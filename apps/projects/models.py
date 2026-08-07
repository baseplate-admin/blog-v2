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
from apps.projects.github import fetch_repo_data, format_time_ago


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
        blank=True,
        help_text="Link to the GitHub repository. Stats are fetched automatically.",
    )
    demo_url: models.URLField = models.URLField(
        blank=True, help_text="Link to the live demo"
    )
    featured: models.BooleanField = models.BooleanField(
        default=False, help_text="Mark this project as featured on the homepage"
    )

    # Cached GitHub repo data
    gh_full_name: models.CharField = models.CharField(
        max_length=255,
        blank=True,
        editable=False,
        help_text="Auto-filled from GitHub (e.g. owner/repo)",
    )
    gh_description: models.TextField = models.TextField(
        blank=True,
        editable=False,
        help_text="Auto-filled from GitHub",
    )
    gh_stars: models.PositiveIntegerField = models.PositiveIntegerField(
        default=0,
        editable=False,
        help_text="Auto-filled from GitHub",
    )
    gh_forks: models.PositiveIntegerField = models.PositiveIntegerField(
        default=0,
        editable=False,
        help_text="Auto-filled from GitHub",
    )
    gh_language: models.CharField = models.CharField(
        max_length=50,
        blank=True,
        editable=False,
        help_text="Primary language detected by GitHub",
    )
    gh_last_updated: models.DateTimeField = models.DateTimeField(
        null=True,
        blank=True,
        editable=False,
        help_text="Last push date from GitHub",
    )

    search_fields: list[index.SearchField] = Page.search_fields + [
        index.SearchField("description"),
        index.SearchField("gh_full_name"),
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

    def on_publish(self) -> None:
        super().on_publish()
        self._sync_github_data()

    def on_publish_revision(self, previous_revision: Any) -> None:
        super().on_publish_revision(previous_revision)
        self._sync_github_data()

    def _sync_github_data(self) -> None:
        """Fetch and cache GitHub repo stats."""
        if not self.github_url:
            return
        data = fetch_repo_data(self.github_url)
        if data.error:
            return
        self.gh_full_name = data.full_name
        self.gh_description = data.description
        self.gh_stars = data.stars
        self.gh_forks = data.forks
        self.gh_language = data.language
        self.gh_last_updated = data.last_updated
        # Save without triggering on_publish again
        self.save(update_timestamp=False)

    def get_github_data(self) -> dict[str, Any]:
        """Return current cached GitHub data as a dict for templates."""
        return {
            "full_name": self.gh_full_name,
            "description": self.gh_description,
            "stars": self.gh_stars,
            "forks": self.gh_forks,
            "language": self.gh_language,
            "last_updated": format_time_ago(self.gh_last_updated),
            "has_url": bool(self.github_url),
        }
