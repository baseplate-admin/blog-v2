"""Lean search: a single DB query over live posts, no search index, no cache.

The full post list is loaded once per page load and the modal filters it
client-side (instant, no round-trips). Only primitives are serialized so the
payload stays small and the frontend holds the one source of truth for badges.
"""

from __future__ import annotations

from typing import Any

from django.utils.formats import date_format

from apps.blog.models import BlogPage


def search_posts(query: str) -> list[dict[str, Any]]:
    """Return matching live posts (title or intro contains the query).

    Empty query returns all live posts (used to populate the modal).
    """
    qs: Any = BlogPage.objects.live().specific().order_by("-first_published_at")
    if query:
        qs = qs.filter(title__icontains=query) | qs.filter(intro__icontains=query)

    posts: list[dict[str, Any]] = []
    for page in qs[:50]:
        posts.append(
            {
                "url": page.url,
                "title": page.title,
                "intro": page.intro or "",
                "mood": page.mood,
                "date": date_format(page.date, "j F Y"),
            }
        )
    return posts
