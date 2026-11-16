"""Generic Inertia integration that inspects each page class at inheritance.

Declare a page exactly like this (``Page`` first is fine)::

    class ActualPage(Page, InertiaMixin):
        # optional; defaults to the class name minus a trailing "Page"
        component = "Actual"

When ``ActualPage`` is created, ``InertiaMixin.__init_subclass__`` inspects it
and wires ``serve()`` directly onto the class, so Inertia wins over
``Page.serve`` even though ``Page`` comes first in the MRO.

At request time the mixin introspects the page instance and its view context;
there is no per-page serializer to maintain:

- Every concrete model field (and m2m, e.g. ``tags``) is dumped by type.
- ``StreamField`` values become ``[{"type": <block name>, "value": {...}}]``.
- Context values (querysets, paginator pages, tag counts) are dumped too.
- Generic site chrome (meta, nav, current path) is built from the page.
- Installed apps may add shared props via ``<app>.inertia::shared_props``.

This package imports no project models and knows no page or block types.
"""

import importlib.util
from datetime import date, datetime, time
from decimal import Decimal
from functools import lru_cache
from typing import Any

from django.apps import apps as django_apps
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Model, QuerySet
from django.http import HttpRequest, HttpResponse
from django.utils.html import format_html
from inertia import render as inertia_render
from wagtail.blocks import StructBlock
from wagtail.blocks.list_block import ListValue
from wagtail.fields import StreamValue
from wagtail.rich_text import RichText

# ── Runtime inspection helpers ────────────────────────────────────────────────


def _component_name(page: Any) -> str:
    component = getattr(type(page), "component", None)
    if component:
        return component
    return _derive_component(type(page).__name__)


def _derive_component(name: str) -> str:
    return name.removesuffix("Page")


def _get_site(page: Any) -> Any:
    """Return the page's site, or None when the page is not routable."""
    try:
        return page.get_site()
    except AttributeError:
        return None
    except ObjectDoesNotExist:
        return None


def _nav_props(page: Any) -> dict[str, Any]:
    """Build nav links from the site root's live children, keyed by slug."""
    site = _get_site(page)
    root = site.root_page if site else None
    if root is None:
        return {}
    return {child.slug: child.url for child in root.get_children().live().public()}


def _site_name(page: Any) -> str:
    site = _get_site(page)
    if site is not None and site.site_name:
        return site.site_name
    # Fall back to the Wagtail Site's hostname-derived name, or a generic default
    from django.conf import settings
    return getattr(settings, "INERTIA_DEFAULT_SITE_NAME", "My Site")


def _meta_props(page: Any) -> dict[str, Any]:
    """Generic SEO / Open Graph props derived from the page instance."""
    if page is None:
        return {
            "title": _site_name(None),
            "seo_title": None,
            "search_description": None,
            "og_type": "website",
            "og_image": None,
            "og_image_alt": None,
            "site_name": _site_name(None),
            "og_url": None,
        }

    seo_title = page.seo_title or page.specific_deferred.title
    site_name = _site_name(page)
    root_url = ((site := _get_site(page)) and site.root_url) or ""

    og_image: str | None = None
    og_image_alt: str | None = None
    feed_image = getattr(page, "feed_image", None)
    if feed_image and feed_image.file:
        og_image = root_url + feed_image.file.url
        og_image_alt = seo_title

    return {
        "title": page.specific_deferred.title,
        "seo_title": seo_title,
        "search_description": page.search_description or "",
        "og_type": "article" if getattr(page, "date", None) else "website",
        "og_image": og_image,
        "og_image_alt": og_image_alt,
        "site_name": site_name,
        "og_url": (root_url + page.url) if page.url else None,
    }


# ── Generic value dumping ─────────────────────────────────────────────────────

# Wagtail/Django internals that should never be sent to the client.
_PAGE_SKIP_FIELDS = frozenset(
    {
        "id",
        "page_ptr",
        "path",
        "depth",
        "numchild",
        "content_type",
        "live",
        "has_unpublished_changes",
        "locked_by",
        "latest_revision",
        "live_revision",
        "go_live_at",
        "expire_at",
        "expired",
        "url_path",
        "draft_title",
        "translation_key",
        "locale",
        "alias_of",
        "latest_revision_created_at",
    }
)
_CONTEXT_SKIP_KEYS = frozenset({"self", "page", "request"})

_BLOCK_CONTEXT_KEYS = frozenset({"self", "value", "block", "request"})


def _serialize_image(image: Any) -> dict[str, Any]:
    file = getattr(image, "file", None)
    return {
        "url": file.url if file else None,
        "alt": getattr(image, "default_alt_text", None)
        or getattr(image, "title", "")
        or "",
        "width": getattr(image, "width", None),
        "height": getattr(image, "height", None),
        "dominant_color_hex": getattr(image, "dominant_color_hex", None),
    }


def _is_page(value: Any) -> bool:
    return hasattr(value, "specific_class") and hasattr(value, "url")


def _serialize_model(obj: Any, depth: int) -> dict[str, Any]:
    if hasattr(obj, "get_username"):
        return {"id": obj.pk, "username": obj.get_username()}
    if _is_page(obj):
        return _serialize_page(obj, depth + 1)
    return {"id": getattr(obj, "pk", None), "label": str(obj)}


def _serialize_stream(stream: Any, depth: int) -> list[dict[str, Any]]:
    blocks: list[dict[str, Any]] = []
    for child in stream:
        data = _serialize_value(child.value, depth + 1)
        # Plain-value blocks (RichTextBlock, CharBlock, ImageChooserBlock)
        # serialize to a scalar (string / int / dict-of-image-fields). The
        # React components for these (Paragraph, Image) read block.value
        # directly as the scalar, so pass it through unwrapped.
        #
        # StructBlock children (aos_heading, code, callout, stats_grid, ...)
        # serialize to a dict of their named fields, which the React
        # components read as block.value.<field>. They pass through as-is.
        block_def = child.block
        if isinstance(block_def, StructBlock) and (
            type(block_def).get_context is not StructBlock.get_context
        ):
            computed = block_def.get_context(child.value)
            for key, extra in computed.items():
                if key in _BLOCK_CONTEXT_KEYS:
                    continue
                data.setdefault(key, _serialize_value(extra, depth + 1))
        blocks.append({"type": child.block_type, "value": data})
    return blocks


def _serialize_value(value: Any, depth: int = 0) -> Any:
    """Dump a value into JSON-safe primitives, recursively."""
    if depth > 8:
        return str(value)
    if value is None or isinstance(value, (bool, int, float)):
        return value
    if isinstance(value, RichText):
        # RichText.source is the raw HTML string (there is no .html attribute).
        return value.source
    if isinstance(value, str):
        return value
    if isinstance(value, Decimal):
        return float(value)
    if isinstance(value, (datetime, date, time)):
        return value.isoformat()
    if isinstance(value, StreamValue):
        return _serialize_stream(value, depth)
    if isinstance(value, ListValue):
        # ListBlock values (stats, cards, tabs, timeline items, steps).
        # Items are StructValue (dict-like) or scalars; the React components
        # expect a plain array of {named fields} or primitives.
        return [_serialize_value(item, depth + 1) for item in value]
    if isinstance(value, dict):
        return {
            str(key): _serialize_value(item, depth + 1) for key, item in value.items()
        }
    if isinstance(value, QuerySet):
        return [_serialize_value(item, depth + 1) for item in value[:200]]
    if hasattr(value, "object_list") and hasattr(value, "paginator"):
        return {
            "items": [_serialize_value(item, depth + 1) for item in value.object_list],
            "number": value.number,
            "num_pages": value.paginator.num_pages,
            "count": value.paginator.count,
            "has_next": value.has_next(),
            "has_previous": value.has_previous(),
        }
    if isinstance(value, (list, tuple, set)):
        return [_serialize_value(item, depth + 1) for item in value]
    if hasattr(value, "get_rendition") and hasattr(value, "file"):
        return _serialize_image(value)
    if isinstance(value, Model):
        return _serialize_model(value, depth)
    return str(value)


def _serialize_page(page: Any, depth: int = 0) -> dict[str, Any]:
    props: dict[str, Any] = {}
    for field in page._meta.concrete_fields:
        if field.name in _PAGE_SKIP_FIELDS:
            continue
        props[field.name] = _serialize_value(getattr(page, field.name), depth + 1)
    for field in page._meta.many_to_many:
        manager = getattr(page, field.name)
        if hasattr(manager, "names"):
            props[field.name] = list(manager.names())
        else:
            props[field.name] = [
                _serialize_value(item, depth + 1) for item in manager.all()[:200]
            ]
    props["url"] = page.url
    props["model"] = f"{page._meta.app_label}.{page._meta.model_name}"
    return props


def _serialize_context(context: dict[str, Any]) -> dict[str, Any]:
    return {
        key: _serialize_value(value)
        for key, value in context.items()
        if key not in _CONTEXT_SKIP_KEYS and not key.startswith("_")
    }


@lru_cache(maxsize=1)
def _shared_providers() -> tuple[Any, ...]:
    """Discover ``shared_props`` providers in ``<installed_app>.inertia``."""
    providers: list[Any] = []
    for config in django_apps.get_app_configs():
        module_name = f"{config.name}.inertia"
        try:
            spec = importlib.util.find_spec(module_name)
        except ImportError:
            continue
        except AttributeError:
            continue
        except ValueError:
            continue
        if spec is None:
            continue
        provider = getattr(importlib.import_module(module_name), "shared_props", None)
        if callable(provider):
            providers.append(provider)
    return tuple(providers)


def _shared_props(page: Any, request: HttpRequest | None) -> dict[str, Any]:
    props: dict[str, Any] = {
        "nav": _nav_props(page),
        "site": {
            "site_name": _site_name(page),
            "copyright_from": None,
            "copyright_to": None,
            "license_type": None,
            "license_label": "",
        },
        "meta": _meta_props(page),
        "current_path": getattr(request, "path", None),
    }
    for provider in _shared_providers():
        for key, value in (provider(request, page) or {}).items():
            if isinstance(value, dict) and isinstance(props.get(key), dict):
                props[key] = {**props[key], **value}
            else:
                props[key] = value
    return props


def _page_props(page: Any, context: dict[str, Any]) -> dict[str, Any]:
    """Auto-dump the page model and its view context."""
    return {**_serialize_page(page), **_serialize_context(context)}


# Default hooked methods. Subclasses may override either one.
def _default_get_inertia_props(
    self: Any, request: HttpRequest, context: dict[str, Any]
) -> dict[str, Any]:
    return _page_props(self, context)


def _inertia_serve(
    self: Any, request: HttpRequest, *args: Any, **kwargs: Any
) -> HttpResponse:
    context = self.get_context(request, *args, **kwargs)
    props = {**_shared_props(self, request), **self.get_inertia_props(request, context)}
    return inertia_render(
        request, _component_name(self), props, template_data=_seo_tags(props)
    )


# ── Public API ────────────────────────────────────────────────────────────────


def render_inertia(
    request: HttpRequest,
    component: str,
    props: dict[str, Any] | None = None,
    page: Any = None,
) -> HttpResponse:
    """Render an Inertia response for non-page views (e.g. the search modal)."""
    payload = {**_shared_props(page, request), **(props or {})}
    return inertia_render(request, component, payload, template_data=_seo_tags(payload))


def _seo_tags(props: dict[str, Any]) -> dict[str, Any]:
    """Build server-rendered <head> tags from the shared ``meta`` prop.

    Rendered into ``{% block inertia_head %}`` on the first (non-XHR) load so
    crawlers see a complete SEO page without executing JavaScript.
    """
    meta = props.get("meta") or {}
    title = meta.get("seo_title") or meta.get("title") or ""
    site_name = meta.get("site_name") or ""
    full_title = f"{title} - {site_name}" if site_name else title
    description = meta.get("search_description") or ""
    og_image = meta.get("og_image") or ""
    tags = [format_html("<title>{}</title>", full_title)]
    if description:
        tags.append(format_html('<meta name="description" content="{}">', description))
    # RSS feed URL is configurable; defaults to /feed/ for backward compat
    from django.conf import settings

    feed_url = getattr(settings, "INERTIA_RSS_FEED_URL", "/feed/")
    if feed_url:
        tags.append(
            format_html(
                '<link rel="alternate" type="application/rss+xml" title="RSS Feed" href="{}">',
                feed_url,
            )
        )
    if title:
        tags.append(format_html('<meta property="og:title" content="{}">', title))
    if description:
        tags.append(
            format_html('<meta property="og:description" content="{}">', description)
        )
    if meta.get("og_url"):
        tags.append(
            format_html('<meta property="og:url" content="{}">', meta["og_url"])
        )
    tags.append(format_html('<meta property="og:site_name" content="{}">', site_name))
    tags.append(
        format_html(
            '<meta property="og:type" content="{}">', meta.get("og_type") or "website"
        )
    )
    if og_image:
        tags.append(format_html('<meta property="og:image" content="{}">', og_image))
    if meta.get("og_image_alt"):
        tags.append(
            format_html(
                '<meta property="og:image:alt" content="{}">', meta["og_image_alt"]
            )
        )
    tags.append(
        format_html(
            '<meta name="twitter:card" content="{}">',
            "summary_large_image" if og_image else "summary",
        )
    )
    if meta.get("seo_title"):
        tags.append(
            format_html('<meta name="twitter:title" content="{}">', meta["seo_title"])
        )
    if description:
        tags.append(
            format_html('<meta name="twitter:description" content="{}">', description)
        )
    return {"seo_tags": tags}


class InertiaMixin:
    """Wire a Wagtail page into Inertia by inspecting it at class creation."""

    component: str | None = None

    def __init_subclass__(cls, **kwargs: Any) -> None:
        super().__init_subclass__(**kwargs)
        # Inspect the concrete page class now that it exists.
        if "component" not in cls.__dict__:
            cls.component = _derive_component(cls.__name__)
        if not hasattr(cls, "get_inertia_props"):
            cls.get_inertia_props = _default_get_inertia_props  # type: ignore[assignment]
        if "serve" not in cls.__dict__:
            cls.serve = _inertia_serve  # type: ignore[assignment]
