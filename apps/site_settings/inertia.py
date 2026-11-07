"""Contribute site settings to every Inertia response.

Discovered at runtime by ``mixins.inertia`` through the ``shared_props`` hook
in ``<app>.inertia`` — no central registry required.
"""

from __future__ import annotations

from typing import Any


def shared_props(request: Any, page: Any) -> dict[str, Any]:
    from .serializers import serialize_site_settings

    return {"site": serialize_site_settings()}
