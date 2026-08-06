from typing import Any

from django.db import models
from django.http import HttpRequest, HttpResponse
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page

from wagtail.admin.panels import FieldPanel, MultiFieldPanel, ObjectList
from wagtail.fields import RichTextField
from wagtail.models import Page
from wagtail.search import index

from apps.home.models import HomePage


class ProjectIndexPage(Page):
    intro: RichTextField = RichTextField(
        blank=True,
        features=["bold", "italic", "link"],
        help_text="Introductory text shown at the top of the projects page.",
    )
    max_count: int = 1

    search_fields: list[index.SearchField] = Page.search_fields + [
        index.SearchField("intro"),
    ]

    content_panels: list[FieldPanel] = Page.content_panels + [
        FieldPanel("intro"),
    ]
    editor_panels: list[ObjectList] = [
        ObjectList(content_panels, heading="Content"),
        ObjectList(Page.promote_panels, heading="Promote"),
        ObjectList(Page.settings_panels, heading="Settings"),
    ]

    subpage_types: list[str] = ["ProjectPage"]
    parent_page_types: list[type[Page]] = [HomePage]

    @method_decorator(cache_page(300))
    def serve(self, request: HttpRequest) -> HttpResponse:
        return super().serve(request)

    def get_context(self, request: HttpRequest) -> dict[str, Any]:
        context: dict[str, Any] = super().get_context(request)
        # Get live project pages
        context["projects"] = (
            self.get_children().live().specific().order_by("-first_published_at")
        )
        return context


class ProjectPage(Page):
    description: RichTextField = RichTextField(
        features=["h2", "h3", "bold", "italic", "link", "image"],
        help_text="Detailed description of the project.",
    )
    github_url: models.URLField = models.URLField(
        blank=True, help_text="Link to the GitHub repository"
    )
    demo_url: models.URLField = models.URLField(
        blank=True, help_text="Link to the live demo"
    )
    featured: models.BooleanField = models.BooleanField(
        default=False, help_text="Mark this project as featured on the homepage"
    )

    search_fields: list[index.SearchField] = Page.search_fields + [
        index.SearchField("description"),
    ]

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
    editor_panels: list[ObjectList] = [
        ObjectList(content_panels, heading="Content"),
        ObjectList(Page.promote_panels, heading="Promote"),
        ObjectList(Page.settings_panels, heading="Settings"),
    ]

    parent_page_types: list[type[Page]] = [ProjectIndexPage]
    subpage_types: list[str] = []

    @method_decorator(cache_page(300))
    def serve(self, request: HttpRequest) -> HttpResponse:
        return super().serve(request)
