from django.db import models

from wagtail.models import Page
from wagtail.admin.panels import FieldPanel
from wagtail.fields import RichTextField, StreamField

from .blocks import CTABlock

class HomePage(Page):
    max_count = 1
    parent_page_types = ['wagtailcore.Page']

    # Editable hero fields
    hero_title = models.CharField(max_length=255, blank=False, default="Building things with Code & Passion")
    hero_subtitle = RichTextField(blank=True)

    hero_ctas = StreamField([
        ('cta', CTABlock()),
    ], blank=True)

    # Allow editors to control how many latest posts are shown
    latest_posts_count = models.PositiveSmallIntegerField(default=3)

    content_panels = Page.content_panels + [
        FieldPanel('hero_title'),
        FieldPanel('hero_subtitle'),
        FieldPanel('hero_ctas'),
        FieldPanel('latest_posts_count'),
    ]

    def get_context(self, request):
        context = super().get_context(request)
        # Import dynamically to avoid circular dependency
        from apps.blog.models import BlogPage
        # Get latest published blog posts using editable count
        count = getattr(self, 'latest_posts_count', 3) or 3
        context['latest_posts'] = BlogPage.objects.live().public().order_by('-first_published_at')[:count]

        # Get featured projects for the homepage
        from apps.projects.models import ProjectPage
        try:
            context['featured_projects'] = ProjectPage.objects.live().public().filter(featured=True).order_by('-first_published_at')[:3]
        except ProjectPage.DoesNotExist:
            context['featured_projects'] = []
        return context
 
