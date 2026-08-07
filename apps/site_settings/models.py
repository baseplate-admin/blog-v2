
import datetime
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.contrib.settings.models import BaseSiteSetting, register_setting


class LicenseOptions(models.TextChoices):
    ALL_RIGHTS: str = "all_rights", "All Rights Reserved"
    MIT: str = "mit", "MIT License"
    APACHE_2: str = "apache_2_0", "Apache License 2.0"
    GPL_3: str = "gpl_3", "GNU GPL v3"
    BSD_3: str = "bsd_3_clause", "BSD 3-Clause"
    CC_BY: str = "cc_by", "CC BY 4.0"
    CC_BY_SA: str = "cc_by_sa", "CC BY-SA 4.0"
    CC_BY_NC: str = "cc_by_nc", "CC BY-NC 4.0"
    CC0: str = "cc0", "CC0 1.0"
    PUBLIC_DOMAIN: str = "public_domain", "Public Domain"


@register_setting
class SiteConfigSettings(BaseSiteSetting):
    site_name: models.CharField = models.CharField(max_length=32, help_text="Display name of the site.")

    site_copyright_from: models.PositiveSmallIntegerField = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(datetime.date.today().year),
        ],
        help_text="Starting year for the copyright notice.",
    )
    site_copyright_to: models.PositiveSmallIntegerField = models.PositiveSmallIntegerField(
        null=True,
        blank=True,
        validators=[
            MinValueValidator(1900),
            MaxValueValidator(datetime.date.today().year),
        ],
        help_text="Ending year for the copyright notice.",
    )

    license_type: models.CharField = models.CharField(
        max_length=20,
        choices=LicenseOptions.choices,
        null=True,
        help_text="The legal license governing the site's content.",
    )

    github_token: models.CharField = models.CharField(
        max_length=255,
        blank=True,
        help_text="Personal Access Token for GitHub API rate limit (1000 req/hr vs 60). Generate at https://github.com/settings/tokens. No scopes needed for public repo data.",
    )

    panels: list[FieldPanel | MultiFieldPanel] = [
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
        MultiFieldPanel(
            [
                FieldPanel("github_token"),
            ],
            heading="External API Tokens",
        ),
    ]

    def clean(self) -> None:
        super().clean()
        if self.site_copyright_from and self.site_copyright_to:
            if self.site_copyright_from > self.site_copyright_to:
                raise ValidationError(
                    {
                        "site_copyright_from": "The start year cannot be after the end year.",
                        "site_copyright_to": "The end year cannot be before the start year.",
                    }
                )
