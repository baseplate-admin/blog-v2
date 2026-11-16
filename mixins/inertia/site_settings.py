"""App-agnostic Inertia site-settings integration.

Shared by every settings app (e.g. ``apps.site_settings``). This layer imports
no project models, hardcodes no field names, and has no knowledge of any
specific setting (licenses, moods, etc.) -- it follows the same approach as
``mixins.inertia.page``:

- ``SiteSettingMixin`` is a pure mixin (no Django model inheritance) that a
  settings model mixes *alongside* ``BaseSiteSetting`` to declare it feeds the
  Inertia site chrome.
- ``serialize_site_settings()`` is a **generic** field-dumper: it reads the
  fields you pass in via ``getattr`` and returns them as a dict. It knows
  nothing about licenses or any other specific field.
- ``resolve_label()`` is a **generic** key→label resolver (works for any
  ``{key: label}`` map).

A concrete settings app calls ``serialize_site_settings(settings, fields=...)``
and ``resolve_label(key, choices)`` from its own ``<app>.inertia::shared_props``
-- so the app owns its fields, labels, and the final ``site`` prop shape,
while this module owns only the shared helpers.

Usage::

    # models.py
    from django.db import models
    from wagtail.contrib.settings.models import BaseSiteSetting, register_setting
    from mixins.inertia.site_settings import SiteSettingMixin, resolve_label

    @register_setting
    class SiteConfigSettings(BaseSiteSetting, SiteSettingMixin):
        site_name = models.CharField(...)
        license_type = models.CharField(choices=LicenseOptions.choices, ...)

    def license_label(key):
        return resolve_label(key, dict(LicenseOptions.choices))

    # inertia.py  (discovered at runtime by ``page.py``)
    from mixins.inertia.site_settings import serialize_site_settings
    from .models import SiteConfigSettings, license_label

    def shared_props(request, page):
        settings = SiteConfigSettings.load()
        site = serialize_site_settings(settings, fields=("site_name", "site_copyright_from", "site_copyright_to"))
        site["license_type"] = getattr(settings, "license_type", None) or "all_rights"
        site["license_label"] = license_label(site["license_type"])
        return {"site": site}
"""

from typing import Any


class SiteSettingMixin:
    """Marker mixin for settings models that feed the Inertia site chrome.

    Adds no Django model inheritance -- a settings model mixes it in *alongside*
    ``BaseSiteSetting`` so that it declares, in one place, that it participates
    in the shared Inertia site-settings flow. Keeping it a pure mixin (no
    ``BaseSiteSetting`` parent) avoids abstract-model metaclass conflicts and
    lets the model keep its own single model base.
    """


def resolve_label(key: str | None, choices: dict[str, str], default: str = "") -> str:
    """Resolve a choice key to its human label from an app-supplied choices map.

    Generic over the key: works for licenses, moods, or any other
    ``{key: label}`` mapping. Falls back to a title-cased version of the key
    when the key is absent from ``choices``.
    """
    if not key:
        return default
    return choices.get(key, key.replace("_", " ").title())


def serialize_site_settings(
    settings: Any | None = None,
    fields: tuple[str, ...] | None = None,
) -> dict[str, Any]:
    """Serialize a site-settings instance into a dict.

    ``settings`` is the settings instance to read (``None`` yields an empty dict).
    ``fields`` is a tuple of field names to read off the instance via ``getattr``;
    when absent, no fields are read (returns ``{}``).

    This function is **completely generic**: it has no knowledge of any specific
    field (license, mood, etc.). The app decides which fields to serialize and
    how to transform them.
    """
    if settings is None or fields is None:
        return {}
    return {name: getattr(settings, name, None) for name in fields}
