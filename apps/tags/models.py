from django.db import models

from modern_colorthief import get_palette

from wagtail.images.models import Image, AbstractImage, AbstractRendition


class BlogImage(AbstractImage):
    """Custom image model with automatic palette extraction on upload."""

    palette_json: models.JSONField = models.JSONField(
        default=list,
        blank=True,
        help_text="Auto-generated color palette (list of RGB arrays).",
    )
    dominant_color_hex: models.CharField = models.CharField(
        max_length=7,
        default="",
        blank=True,
        help_text="Auto-generated dominant color in hex format.",
    )

    admin_form_fields: list[str] = Image.admin_form_fields + (
        "palette_json",
        "dominant_color_hex",
    )

    def save(self, *args, **kwargs) -> None:
        super().save(*args, **kwargs)
        self._extract_palette()

    def _extract_palette(self) -> None:
        """Extract color palette using modern_colorthief and persist to DB."""
        try:
            palette: list[tuple[int, int, int]] = get_palette(
                str(self.file.path), color_count=5, quality=10
            )
            if palette:
                self.palette_json = [list(rgb) for rgb in palette]
                self.dominant_color_hex = f"#{palette[0][0]:02x}{palette[0][1]:02x}{palette[0][2]:02x}"
                self.save(update_fields=["palette_json", "dominant_color_hex"])
        except (OSError, ValueError, TypeError):
            pass

    @property
    def dominant_color_css(self) -> str:
        """Return dominant color as CSS rgb() string."""
        if not self.palette_json or len(self.palette_json) == 0:
            return ""
        rgb: list[int] = self.palette_json[0]
        return f"rgb({rgb[0]}, {rgb[1]}, {rgb[2]})"

    @property
    def default_alt_text(self) -> str:
        return getattr(self, "description", None)  # type: ignore[return-value]


class BlogImageRendition(AbstractRendition):
    image: models.ForeignKey = models.ForeignKey(
        BlogImage, on_delete=models.CASCADE, related_name="renditions"
    )

    class Meta:
        constraints: list[models.UniqueConstraint] = [
            models.UniqueConstraint(
                fields=("image", "filter_spec", "focal_point_key"),
                name="unique_rendition",
            )
        ]
