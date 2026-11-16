"""Contribute site settings to every Inertia response.

Discovered at runtime by ``mixins.inertia`` through the ``shared_props`` hook
in ``<app>.inertia`` -- no central registry required.

The model owns its own serialization (``SiteConfigSettings.to_site_props()``);
this module only wires it into the Inertia ``shared_props`` hook.
"""

from typing import Any

from .models import SiteConfigSettings


def shared_props(request: Any, page: Any) -> dict[str, Any]:
    """Inertia ``shared_props`` provider: contributes the ``site`` prop."""
    settings: SiteConfigSettings
    if request is not None:
        try:
            settings = SiteConfigSettings.for_request(request)
        except (AttributeError, ValueError):
            # Request is missing a resolvable host (e.g. in tests or CLI tools);
            # fall back to an empty settings instance.
            settings = SiteConfigSettings()
    else:
        settings = SiteConfigSettings()
    return {"site": settings.to_site_props()}
