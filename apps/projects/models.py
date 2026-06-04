from __future__ import annotations

from typing import Any

from django.db import models
from django.http import HttpRequest

from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.blocks import RichTextBlock
from wagtail.fields import RichTextField, StreamField
from wagtail.images.blocks import ImageChooserBlock
from wagtail.models import Page


class ProjectIndexPage(Page):
    intro: RichTextField = RichTextField(blank=True, help_text="Introductory text shown at the top of the projects page.")
    max_count: int = 1

    content_panels: list[FieldPanel] = Page.content_panels + [
        FieldPanel("intro"),
    ]

    subpage_types: list[str] = ["ProjectPage"]
    parent_page_types: list[str] = ["home.HomePage"]

    def get_context(self, request: HttpRequest) -> dict[str, Any]:
        context: dict[str, Any] = super().get_context(request)
        # Get live project pages
        context["projects"] = self.get_children().live().specific().order_by("-first_published_at")
        return context


class ProjectPage(Page):
    description: RichTextField = RichTextField(help_text="Detailed description of the project.")
    github_url: models.URLField = models.URLField(blank=True, help_text="Link to the GitHub repository")
    demo_url: models.URLField = models.URLField(blank=True, help_text="Link to the live demo")
    featured: models.BooleanField = models.BooleanField(
        default=False, help_text="Mark this project as featured on the homepage"
    )

    image: models.ForeignKey = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Project showcase image",
    )

    content_panels: list[FieldPanel | MultiFieldPanel] = Page.content_panels + [
        FieldPanel("description"),
        MultiFieldPanel(
            [
                FieldPanel("github_url"),
                FieldPanel("demo_url"),
                FieldPanel("featured"),
            ],
            heading="Links",
        ),
        FieldPanel("image"),
    ]

    parent_page_types: list[str] = ["ProjectIndexPage"]
    subpage_types: list[str] = []
