from functools import lru_cache

from django import template
from django.utils.safestring import mark_safe

from modern_colorthief import get_palette
from wagtail.images import get_image_model

register: template.Library = template.Library()

_color_cache: dict[str, list[tuple[int, int, int]]] = {}


def rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    """Convert RGB tuple to hex string."""
    return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"


def rgb_to_css(rgb: tuple[int, int, int]) -> str:
    """Convert RGB tuple to CSS rgb() string."""
    return f"rgb({rgb[0]}, {rgb[1]}, {rgb[2]})"


def _get_cached_palette(image) -> list[tuple[int, int, int]]:
    """Get palette from cached DB field, falling back to on-demand extraction."""
    # Try cached palette from the custom image model
    if hasattr(image, "palette_json") and image.palette_json:
        return [tuple(rgb) for rgb in image.palette_json]

    # Fallback: extract on demand (for images uploaded before migration)
    try:
        return get_palette(str(image.file.path), color_count=5, quality=10)
    except (OSError, ValueError, TypeError):
        return []


@register.filter
def get_dominant_color(image) -> str:
    """Get dominant color hex from a Wagtail image."""
    if not image or not image.file:
        return ""
    # Use cached hex if available
    if hasattr(image, "dominant_color_hex") and image.dominant_color_hex:
        return image.dominant_color_hex
    palette = _get_cached_palette(image)
    if not palette:
        return ""
    return rgb_to_hex(palette[0])


@register.filter
def get_palette_colors(image, count: int = 3) -> list[str]:
    """Get palette colors as hex list from a Wagtail image."""
    if not image or not image.file:
        return []
    palette = _get_cached_palette(image)
    return [rgb_to_hex(color) for color in palette[:count]]


@register.filter
def get_dominant_color_css(image) -> str:
    """Get dominant color as CSS rgb() string."""
    if not image or not image.file:
        return ""
    if hasattr(image, "dominant_color_css"):
        return image.dominant_color_css
    palette = _get_cached_palette(image)
    if not palette:
        return ""
    return rgb_to_css(palette[0])


@register.simple_tag
def image_accent_color(image):
    """Render a CSS custom property tag for image accent color."""
    if not image or not image.file:
        return mark_safe("")
    palette = _get_cached_palette(image)
    if not palette:
        return mark_safe("")
    dominant = rgb_to_css(palette[0])
    return mark_safe(f'style="--accent-color: {dominant}; --accent-bg: {dominant}20;"')
