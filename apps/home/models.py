
from typing import Any

from django.db import models
from django.http import HttpRequest

from wagtail.admin.panels import FieldPanel
from wagtail.fields import RichTextField, StreamField
from wagtail.models import Page

from .blocks import CTABlock

from apps.blog.blocks import (
    AOSCardGridBlock,
    AOSCalloutBlock,
    AOSHeadingBlock,
    AOSHighlightBlock,
    AOSImageBlock,
    AOSQuoteBlock,
    AOSStatsGridBlock,
    AOSSeparatorBlock,
)


class HomePage(Page):
    max_count: int = 1
    parent_page_types: list[str] = ["wagtailcore.Page"]

    # Editable hero fields
    hero_title: models.CharField = models.CharField(
        max_length=255, blank=False, default="Building things with Code & Passion",
        help_text="Main heading displayed in the hero section.",
    )
    hero_subtitle: RichTextField = RichTextField(blank=True, help_text="Supporting text below the hero title.")

    hero_ctas: StreamField = StreamField(
        [("cta", CTABlock())],
        blank=True,
        help_text="Call-to-action buttons in the hero section.",
    )

    # Allow editors to control how many latest posts are shown
    latest_posts_count: models.PositiveSmallIntegerField = models.PositiveSmallIntegerField(
        default=3, help_text="Number of recent blog posts to display on the homepage.",
    )

    # Editable body with AOS animated blocks
    body: StreamField = StreamField(
        [
            ("aos_heading", AOSHeadingBlock()),
            ("aos_quote", AOSQuoteBlock()),
            ("aos_highlight", AOSHighlightBlock()),
            ("aos_separator", AOSSeparatorBlock()),
            ("aos_image", AOSImageBlock()),
            ("aos_callout", AOSCalloutBlock()),
            ("aos_stats_grid", AOSStatsGridBlock()),
            ("aos_card_grid", AOSCardGridBlock()),
        ],
        blank=True,
        use_json_field=True,
        help_text="Animated content blocks for the homepage.",
    )

    content_panels: list[FieldPanel] = Page.content_panels + [
        FieldPanel("hero_title"),
        FieldPanel("hero_subtitle"),
        FieldPanel("hero_ctas"),
        FieldPanel("latest_posts_count"),
        FieldPanel("body"),
    ]

    def get_context(self, request: HttpRequest) -> dict[str, Any]:
        context: dict[str, Any] = super().get_context(request)
        # Import dynamically to avoid circular dependency
        from apps.blog.models import BlogPage
        # Get latest published blog posts using editable count
        count: int = getattr(self, "latest_posts_count", 3) or 3
        context["latest_posts"] = BlogPage.objects.live().public().order_by("-first_published_at")[:count]

        # Get featured projects for the homepage
        from apps.projects.models import ProjectPage
        context["featured_projects"] = ProjectPage.objects.live().public().filter(featured=True).order_by("-first_published_at")[:3]
        return context
