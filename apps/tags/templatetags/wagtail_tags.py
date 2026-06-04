from __future__ import annotations

from typing import TYPE_CHECKING, Any

from django import template
from django.apps import apps

if TYPE_CHECKING:
    from wagtail.models import Page

register: template.Library = template.Library()


@register.simple_tag
def wagtail_url_from_model_slug(app_model: str, slug: str | None = None) -> str | None:
    """
    Get the URL of a Wagtail page by model class and optional slug.
    If max_count=1, slug can be None.

    Usage:
        {% wagtail_url_from_model_slug 'blog.HomePage' %}
        {% wagtail_url_from_model_slug 'blog.BlogPage' 'my-post-slug' %}
    """
    try:
        app_label, model_name = app_model.split(".")
        PageModel = apps.get_model(app_label, model_name)  # type: ignore[assignment]
    except Exception:
        return None

    qs: Any = PageModel.objects.live()
    if slug:
        qs = qs.filter(slug=slug)

    page: Page | None = qs.first()  # type: ignore[assignment]
    if page:
        return page.url
    return None
