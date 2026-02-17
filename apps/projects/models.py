from django.db import models
from wagtail.models import Page
from wagtail.fields import RichTextField, StreamField
from wagtail.blocks import RichTextBlock
from wagtail.admin.panels import FieldPanel, MultiFieldPanel
from wagtail.images.blocks import ImageChooserBlock

from apps.home.models import HomePage


class ProjectIndexPage(Page):
    intro = RichTextField(blank=True)
    max_count = 1

    content_panels = Page.content_panels + [
        FieldPanel("intro"),
    ]

    subpage_types = ["ProjectPage"]
    parent_page_types = ["home.HomePage"]

    def get_context(self, request):
        context = super().get_context(request)
        # Get live project pages
        context['projects'] = self.get_children().live().specific().order_by('-first_published_at')
        return context


class ProjectPage(Page):
    description = RichTextField()
    github_url = models.URLField(blank=True, help_text="Link to the GitHub repository")
    demo_url = models.URLField(blank=True, help_text="Link to the live demo")
    
    image = models.ForeignKey(
        'wagtailimages.Image',
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name='+',
        help_text="Project showcase image"
    )

    content_panels = Page.content_panels + [
        FieldPanel("description"),
        MultiFieldPanel([
            FieldPanel("github_url"),
            FieldPanel("demo_url"),
        ], heading="Links"),
        FieldPanel("image"),
    ]

    parent_page_types = ["ProjectIndexPage"]
    subpage_types = []

