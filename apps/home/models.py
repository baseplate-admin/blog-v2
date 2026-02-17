from django.db import models

from wagtail.models import Page

class HomePage(Page):
    max_count = 1 
    parent_page_types = ['wagtailcore.Page']

    def get_context(self, request):
        context = super().get_context(request)
        # Import dynamically to avoid circular dependency
        from apps.blog.models import BlogPage
        
        # Get 3 latest published blog posts
        context['latest_posts'] = BlogPage.objects.live().public().order_by('-first_published_at')[:3]
        return context
 
