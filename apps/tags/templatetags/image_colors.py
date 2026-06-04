
from functools import lru_cache

from django import template
from django.utils.safestring import mark_safe

from modern_colorthief import get_color, get_palette

register: template.Library = template.Library()

_color_cache: dict[str, list[tuple[int, int, int]]] = {}


@lru_cache(maxsize=128)
def _get_image_palette(image_path: str, color_count: int = 5) -> list[tuple[int, int, int]]:
    """Extract color palette from image file path."""
    try:
        return get_palette(image_path, color_count=color_count, quality=10)
    except Exception:
        return []


def rgb_to_hex(rgb: tuple[int, int, int]) -> str:
    """Convert RGB tuple to hex string."""
    return f"#{rgb[0]:02x}{rgb[1]:02x}{rgb[2]:02x}"


def rgb_to_css(rgb: tuple[int, int, int]) -> str:
    """Convert RGB tuple to CSS rgb() string."""
    return f"rgb({rgb[0]}, {rgb[1]}, {rgb[2]})"


@register.filter
def get_dominant_color(image) -> str:
    """Get dominant color hex from a Wagtail image."""
    if not image or not image.file:
        return ""
    palette = _get_image_palette(str(image.file.path))
    if not palette:
        return ""
    return rgb_to_hex(palette[0])


@register.filter
def get_palette_colors(image, count: int = 3) -> list[str]:
    """Get palette colors as hex list from a Wagtail image."""
    if not image or not image.file:
        return []
    palette = _get_image_palette(str(image.file.path), color_count=count)
    return [rgb_to_hex(color) for color in palette]


@register.simple_tag
def image_accent_color(image):
    """Render a CSS custom property tag for image accent color."""
    if not image or not image.file:
        return mark_safe("")
    palette = _get_image_palette(str(image.file.path))
    if not palette:
        return mark_safe("")
    dominant = rgb_to_css(palette[0])
    return mark_safe(f'style="--accent-color: {dominant}; --accent-bg: {dominant}20;"')
