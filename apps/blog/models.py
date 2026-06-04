
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.db import models
from django.http import HttpRequest
from django.utils.functional import cached_property
from django.utils.html import strip_tags

from modelcluster.contrib.taggit import ClusterTaggableManager
from modelcluster.fields import ParentalKey
from taggit.models import TaggedItemBase

from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.blocks import RichTextBlock
from wagtail.fields import RichTextField, StreamField
from wagtail.images.blocks import ImageChooserBlock
from wagtail.models import Page
from wagtail.search import index
from wagtailcodeblock.blocks import CodeBlock

import readtime

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
from apps.home.models import HomePage


class BlogPageTag(TaggedItemBase):
    content_object: ParentalKey = ParentalKey(
        "BlogPage", related_name="tagged_items", on_delete=models.CASCADE
    )


class BlogIndexPage(Page):
    intro = RichTextField(blank=True, help_text="Introductory text shown at the top of the blog index page.")
    about = RichTextField(blank=True, help_text="Shown in the sidebar about section.")
    subpage_types: list[str] = ["BlogPage"]
    parent_page_types: list[type[Page]] = [HomePage]
    max_count: int = 1

    content_panels: list[FieldPanel] = Page.content_panels + [
        FieldPanel("intro"),
        FieldPanel("about"),
    ]

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
            ("paragraph", RichTextBlock()),
            ("image", ImageChooserBlock()),
            ("code", CodeBlock(label="Code")),
            ("aos_heading", AOSHeadingBlock()),
            ("aos_quote", AOSQuoteBlock()),
            ("aos_highlight", AOSHighlightBlock()),
            ("aos_separator", AOSSeparatorBlock()),
            ("aos_image", AOSImageBlock()),
            ("aos_callout", AOSCalloutBlock()),
            ("aos_stats_grid", AOSStatsGridBlock()),
            ("aos_card_grid", AOSCardGridBlock()),
        ],
        use_json_field=True,
        help_text="Main content of the post. Use paragraphs, images, code blocks, and animated AOS blocks.",
    )
    tags: ClusterTaggableManager = ClusterTaggableManager(through=BlogPageTag, blank=True, help_text="Tags for categorizing this post.")

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
            ],
            heading="Blog information",
        ),
        FieldPanel("intro"),
        FieldPanel("body"),
        FieldPanel("feed_image"),
    ]

    subpage_types: list[str] = []

    @cached_property
    def author_avatar_url(self) -> str:
        import hashlib

        email: str = self.owner.email if self.owner and self.owner.email else ""
        hash_email: str = hashlib.sha256(email.lower().encode("utf-8")).hexdigest()
        return f"https://seccdn.libravatar.org/avatar/{hash_email}?s=200&d=retro"

    @cached_property
    def reading_time(self) -> str:
        parts: list[str] = []

        for block in self.body:
            if block.block_type == "paragraph":
                # RichText stores HTML
                parts.append(strip_tags(block.value.source))
            elif block.block_type == "code":
                parts.append(str(block.value))

        text: str = "\n\n".join(parts)
        result = readtime.of_text(text)
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
