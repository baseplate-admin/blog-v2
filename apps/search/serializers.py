"""Serialize the search modal props for the Inertia client.

The post list is preloaded once and filtered client-side, so the backend does
one lean query (no search index, no cache).
"""

from __future__ import annotations

from typing import Any


def serialize_search(page: Any, context: dict[str, Any]) -> dict[str, Any]:
    from apps.search.models import search_posts

    return {
        "q": context.get("q", ""),
        "posts": search_posts(context.get("q", "")),
    }
