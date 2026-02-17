from django.db import models

from modelcluster.fields import ParentalKey
from modelcluster.contrib.taggit import ClusterTaggableManager
from taggit.models import TaggedItemBase

from wagtail.models import Page
from wagtail.fields import RichTextField, StreamField
from wagtail.blocks import RichTextBlock
from wagtailcodeblock.blocks import CodeBlock
from wagtail.images.blocks import ImageChooserBlock
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.search import index
from apps.home.models import HomePage
from django.utils.html import strip_tags
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.utils.functional import cached_property

import readtime


class BlogPageTag(TaggedItemBase):
    content_object = ParentalKey(
        "BlogPage", related_name="tagged_items", on_delete=models.CASCADE
    )

class BlogIndexPage(Page):
    intro = RichTextField(blank=True)
    subpage_types = ["BlogPage"]
    parent_page_types = [HomePage]
    max_count = 1

    content_panels = Page.content_panels + [
        FieldPanel("intro"),
    ]

    def get_context(self, request):
        # Update context to include only published posts, ordered by reverse-chron
        context = super().get_context(request)
        blogpages = (
            self.get_children().live().specific().order_by("-first_published_at")
        )

        # Filtering by tag
        tag = request.GET.get("tag")
        if tag:
            blogpages = blogpages.filter(blogpage__tags__name=tag)

        # Pagination
        page = request.GET.get("page")
        paginator = Paginator(blogpages, 5)  # Show 5 blog posts per page
        try:
            blogpages = paginator.page(page)
        except PageNotAnInteger:
            blogpages = paginator.page(1)
        except EmptyPage:
            blogpages = paginator.page(paginator.num_pages)

        context["blogpages"] = blogpages
        context["request_tag"] = tag
        return context


class BlogPage(Page):
    parent_page_types = [BlogIndexPage]

    date = models.DateField("Post date")
    intro = models.CharField(max_length=250)
    body = StreamField(
        [
            ("paragraph", RichTextBlock()),
            ("image", ImageChooserBlock()),
            ("code", CodeBlock(label="Code")),
        ],
        use_json_field=True,
    )
    tags = ClusterTaggableManager(through=BlogPageTag, blank=True)

    feed_image = models.ForeignKey(
        "wagtailimages.Image",
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="+",
    )

    search_fields = Page.search_fields + [
        index.SearchField("intro"),
        index.SearchField("body"),
    ]

    content_panels = Page.content_panels + [
        MultiFieldPanel(
            [
                FieldPanel("date"),
                FieldPanel("tags"),
            ],
            heading="Blog information",
        ),
        FieldPanel("intro"),
        FieldPanel("body"),
        FieldPanel("feed_image"),
    ]

    parent_page_types = ["BlogIndexPage"]
    subpage_types = []

    @cached_property
    def author_avatar_url(self):
        import hashlib

        email = self.owner.email if self.owner and self.owner.email else ""
        hash_email = hashlib.sha256(email.lower().encode("utf-8")).hexdigest()
        return f"https://seccdn.libravatar.org/avatar/{hash_email}?s=200&d=retro"

    @cached_property
    def reading_time(self):
        parts = []

        for block in self.body:
            if block.block_type == "paragraph":
                # RichText stores HTML
                parts.append(strip_tags(block.value.source))
            elif block.block_type == "code":
                parts.append(str(block.value))

        text = "\n\n".join(parts)
        result = readtime.of_text(text)
        return result.text
