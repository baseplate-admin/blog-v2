
from django.core.cache import cache
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.db import models
from django.http import HttpRequest, HttpResponse
from django.utils.decorators import method_decorator
from django.utils.functional import cached_property
from django.utils.html import strip_tags
from django.views.decorators.cache import cache_page

from modelcluster.contrib.taggit import ClusterTaggableManager
from modelcluster.fields import ParentalKey
from taggit.models import TaggedItemBase

from wagtail.admin.panels import FieldPanel, MultiFieldPanel, ObjectList
from wagtail.blocks import RichTextBlock
from wagtail.fields import RichTextField, StreamField
from wagtail.images.blocks import ImageChooserBlock
from wagtail.models import Page
from wagtail.search import index
import readtime

from apps.blog.blocks import (
    AOSHeadingBlock,
    AOSHighlightBlock,
    AOSQuoteBlock,
    AlertBlock,
    CardGridBlock,
    CalloutBlock,
    ImageBlock,
    MermaidBlock,
    PygmentsCodeBlock,
    SeparatorBlock,
    StepsBlock,
    StatsGridBlock,
    TabsBlock,
    TimelineBlock,
    TooltipBlock,
)
from apps.home.models import HomePage
from apps.site_settings.models import LicenseOptions


class BlogPageTag(TaggedItemBase):
    content_object: ParentalKey = ParentalKey(
        "BlogPage", related_name="tagged_items", on_delete=models.CASCADE
    )


class BlogIndexPage(Page):
    intro = RichTextField(
        blank=True,
        features=["bold", "italic", "link"],
        help_text="Introductory text shown at the top of the blog index page.",
    )
    about = RichTextField(
        blank=True,
        features=["bold", "italic", "link"],
        help_text="Shown in the sidebar about section.",
    )

    search_fields: list[index.SearchField] = Page.search_fields + [
        index.SearchField("intro"),
        index.SearchField("about"),
    ]

    subpage_types: list[str] = ["BlogPage"]
    parent_page_types: list[type[Page]] = [HomePage]
    max_count: int = 1

    content_panels: list[FieldPanel] = Page.content_panels + [
        FieldPanel("intro"),
        FieldPanel("about"),
    ]
    editor_panels: list[ObjectList] = [
        ObjectList(content_panels, heading="Content"),
        ObjectList(Page.promote_panels, heading="Promote"),
        ObjectList(Page.settings_panels, heading="Settings"),
    ]

    @method_decorator(cache_page(300))  # Cache for 5 minutes
    def serve(self, request: HttpRequest) -> HttpResponse:
        return super().serve(request)

    def get_context(self, request: HttpRequest) -> dict[str, object]:
        # Update context to include only published posts, ordered by reverse-chron
        context: dict[str, object] = super().get_context(request)
        blogpages: object = (
            self.get_children().live().specific().order_by("-first_published_at")
        )

        # Filtering
        if tag := request.GET.get("tag"):
            blogpages = blogpages.filter(blogpage__tags__name=tag)
        if mood := request.GET.get("mood"):
            blogpages = blogpages.filter(blogpage__mood=mood)

        # Pagination
        page_num: str | int = request.GET.get("page", 1)  # type: ignore[assignment]
        paginator: Paginator = Paginator(blogpages, 5)  # Show 5 blog posts per page
        try:
            blogpages = paginator.page(page_num)
        except PageNotAnInteger:
            blogpages = paginator.page(1)
        except EmptyPage:
            blogpages = paginator.page(paginator.num_pages)

        context["blogpages"] = blogpages
        context["request_tag"] = tag
        context["request_mood"] = mood
        context["is_htmx"] = request.headers.get("HX-Request") == "true"

        # Sidebar data: all tags with post counts
        all_pages: object = self.get_children().live().specific()
        from django.db.models import Count

        tag_counts: object = (
            BlogPageTag.objects.select_related("tag")
            .filter(content_object__in=all_pages)
            .values("tag__name")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        context["tag_cloud"] = tag_counts

        # Sidebar: mood choices with labels for filter
        context["mood_choices"] = BlogPage.MOOD_CHOICES

        return context


class BlogPage(Page):
    parent_page_types: list[type[Page]] = [BlogIndexPage]

    MOOD_CHOICES: list[tuple[str, str]] = [
        ("tech", "Technology"),
        ("personal", "Personal"),
        ("politics", "Politics"),
        ("tutorial", "Tutorial"),
        ("opinion", "Opinion"),
        ("announcement", "Announcement"),
        ("research", "Research"),
        ("review", "Review"),
    ]

    date: models.DateField = models.DateField("Post date", help_text="The publication date of this post.")
    mood: models.CharField = models.CharField(
        max_length=32,
        choices=MOOD_CHOICES,
        default="tech",
        help_text="The mood/category of this post. Shown as a colored badge.",
    )
    intro: models.CharField = models.CharField(max_length=250, help_text="Brief summary shown in listings and previews.")
    body: StreamField = StreamField(
        [
            ("paragraph", RichTextBlock(label="Paragraph")),
            ("image", ImageChooserBlock(label="Image")),
            ("code", PygmentsCodeBlock()),
            ("aos_heading", AOSHeadingBlock()),
            ("aos_quote", AOSQuoteBlock()),
            ("aos_highlight", AOSHighlightBlock()),
            ("separator", SeparatorBlock()),
            ("inline_image", ImageBlock()),
            ("callout", CalloutBlock()),
            ("stats_grid", StatsGridBlock()),
            ("card_grid", CardGridBlock()),
            ("tabs", TabsBlock()),
            ("timeline", TimelineBlock()),
            ("steps", StepsBlock()),
            ("alert", AlertBlock()),
            ("tooltip", TooltipBlock()),
            ("mermaid", MermaidBlock()),
        ],
        help_text="Main content of the post. Use paragraphs, images, code blocks, mermaid diagrams, and animated AOS blocks.",
    )
    tags: ClusterTaggableManager = ClusterTaggableManager(through=BlogPageTag, blank=True, help_text="Tags for categorizing this post.")
    license_type: models.CharField = models.CharField(
        max_length=20,
        choices=LicenseOptions.choices,
        default=LicenseOptions.ALL_RIGHTS,
        help_text="License for this post.",
    )

    feed_image: models.ForeignKey = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
        help_text="Image used in social media previews, RSS feeds, and article cover.",
    )

    search_fields: list[index.SearchField] = Page.search_fields + [
        index.SearchField("intro"),
        index.SearchField("body"),
    ]

    content_panels: list[FieldPanel | MultiFieldPanel] = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("date"),
                FieldPanel("mood"),
                FieldPanel("tags"),
                FieldPanel("license_type"),
            ],
            heading="Blog information",
        ),
        FieldPanel("intro"),
        FieldPanel("body"),
        FieldPanel("feed_image"),
    ]
    editor_panels: list[ObjectList] = [
        ObjectList(content_panels, heading="Content"),
        ObjectList(Page.promote_panels, heading="Promote"),
        ObjectList(Page.settings_panels, heading="Settings"),
    ]

    subpage_types: list[str] = []

    @method_decorator(cache_page(300))  # Cache for 5 minutes
    def serve(self, request: HttpRequest) -> HttpResponse:
        return super().serve(request)

    @cached_property
    def author_avatar_url(self) -> str:
        import hashlib
        from django.contrib.auth import get_user_model

        User = get_user_model()
        author = User.objects.first()
        if author and author.email:
            email_hash: str = hashlib.sha256(author.email.lower().encode("utf-8")).hexdigest()
            return f"https://seccdn.libravatar.org/avatar/{email_hash}?s=200&d=retro"
        return ""

    @cached_property
    def reading_time(self) -> str:
        # Use Redis cache keyed by page state
        cached = cache.get(f"reading_time_{self.cache_key}")
        if cached:
            return cached  # type: ignore[return-value]

        parts: list[str] = []

        for block in self.body:
            if block.block_type == "paragraph":
                parts.append(strip_tags(block.value.source))
            elif block.block_type == "code":
                parts.append(str(block.value))

        text: str = "\n\n".join(parts)
        result = readtime.of_text(text)
        cache.set(f"reading_time_{self.cache_key}", result.text, 3600)
        return result.text

    def get_toc_headings(self) -> list[dict[str, str]]:
        """Extract h2/h3 headings from StreamField body for server-side TOC."""
        headings: list[dict[str, str]] = []

        for block in self.body:
            if block.block_type == "aos_heading":
                level = block.value.level
                if level in ("h2", "h3"):
                    headings.append(
                        {
                            "id": f"heading-{block.id}",
                            "text": block.value.text,
                            "level": level,
                        }
                    )
            elif block.block_type == "paragraph":
                html = block.value.source
                import re

                matches = re.finditer(r"<(h[23])[^>]*>(.*?)</\1>", html, re.DOTALL)
                for m in matches:
                    tag = m.group(1)
                    text = strip_tags(m.group(2)).strip()
                    if text:
                        headings.append(
                            {
                                "id": f"section-{len(headings)}",
                                "text": text,
                                "level": tag,
                            }
                        )

        return headings
