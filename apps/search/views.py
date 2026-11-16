"""Search view: renders the Inertia search modal.

The search "page" is not a Wagtail Page - it is a thin view that renders the
Inertia search component directly. The post list is preloaded once; the modal
filters it client-side.
"""

from __future__ import annotations

from django.http import HttpRequest, HttpResponse
from wagtail.models import Page, Site

from apps.search.serializers import serialize_search
from mixins.inertia.page import render_inertia


def _root_page() -> Page | None:
    site = Site.objects.filter(is_default_site=True).first() or Site.objects.first()
    return site.root_page if site else Page.objects.live().first()


def search_view(request: HttpRequest) -> HttpResponse:
    """Render the search modal (Inertia component: SearchPage)."""
    # Pass the site root page so shared chrome (nav/site/meta) resolves.
    page: Page | None = _root_page()
    props = serialize_search(page, {"q": request.GET.get("q", "").strip()})
    return render_inertia(request, "SearchPage", props, page=page)
