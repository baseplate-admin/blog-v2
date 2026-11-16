"""App-agnostic Inertia integration."""

from .page import InertiaMixin, render_inertia
from .site_settings import SiteSettingMixin, serialize_site_settings

__all__ = [
    "InertiaMixin",
    "SiteSettingMixin",
    "render_inertia",
    "serialize_site_settings",
]
