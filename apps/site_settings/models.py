from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
import datetime
from django.core.exceptions import ValidationError
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.contrib.settings.models import BaseSiteSetting, register_setting


class LicenseOptions(models.TextChoices):
    ALL_RIGHTS = "all_rights", "All Rights Reserved"
    MIT = "mit", "MIT License"
    CC_BY = "cc_by", "Creative Commons BY"
    CC_BY_SA = "cc_by_sa", "Creative Commons BY-SA"
    GPL_3 = "gpl_3", "GNU GPL v3"


@register_setting
class SiteConfigSettings(BaseSiteSetting):
    site_name = models.CharField(max_length=32)

    site_copyright_from = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(datetime.date.today().year),
        ],
    )
    site_copyright_to = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(datetime.date.today().year),
        ],
    )

    license_type = models.CharField(
        max_length=20,
        choices=LicenseOptions.choices,
        default=LicenseOptions.ALL_RIGHTS,
        help_text="The legal license governing the site's content.",
    )

    panels = [
        FieldPanel("site_name"),
        MultiFieldPanel(
            [
                FieldPanel("site_copyright_from"),
                FieldPanel("site_copyright_to"),
            ],
            heading="Copyright Duration",
        ),
        MultiFieldPanel(
            [
                FieldPanel("license_type"),
            ],
            heading="Legal & Licensing",
        ),
    ]

    def clean(self):
        super().clean()
        if self.site_copyright_from and self.site_copyright_to:
            if self.site_copyright_from > self.site_copyright_to:
                raise ValidationError(
                    {
                        "site_copyright_from": "The start year cannot be after the end year.",
                        "site_copyright_to": "The end year cannot be before the start year.",
                    }
                )
