"""Serialize SiteConfigSettings for the shared site chrome (footer)."""

from __future__ import annotations

from typing import Any

LICENSE_LABELS: dict[str, str] = {
    "all_rights": "All Rights Reserved",
    "mit": "MIT License",
    "apache_2_0": "Apache License 2.0",
    "gpl_3": "GNU GPL v3",
    "bsd_3_clause": "BSD 3-Clause",
    "cc_by": "CC BY 4.0",
    "cc_by_sa": "CC BY-SA 4.0",
    "cc_by_nc": "CC BY-NC 4.0",
    "cc0": "CC0 1.0",
    "public_domain": "Public Domain",
}


def license_label(license_key: str) -> str:
    return LICENSE_LABELS.get(
        license_key, license_key.replace("_", " ").title() if license_key else ""
    )


def serialize_site_settings() -> dict[str, Any]:
    """Serialize SiteConfigSettings for the footer."""
    from .models import SiteConfigSettings

    try:
        conf = SiteConfigSettings.load()
    except Exception:
        return {
            "site_name": "The Tinkerer",
            "copyright_from": None,
            "copyright_to": None,
            "license_type": None,
            "license_label": "MIT License",
        }

    license_key = conf.license_type or "all_rights"
    return {
        "site_name": conf.site_name or "The Tinkerer",
        "copyright_from": conf.site_copyright_from,
        "copyright_to": conf.site_copyright_to,
        "license_type": license_key,
        "license_label": license_label(license_key),
    }
