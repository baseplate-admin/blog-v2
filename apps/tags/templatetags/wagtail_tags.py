# myapp/templatetags/wagtail_tags.py
from django import template
from django.apps import apps

register = template.Library()

@register.simple_tag
def wagtail_url_from_model_slug(app_model, slug=None):
    """
    Get the URL of a Wagtail page by model class and optional slug.
    If max_count=1, slug can be None.
    
    Usage:
        {% wagtail_url_from_model_slug 'blog.HomePage' %}
        {% wagtail_url_from_model_slug 'blog.BlogPage' 'my-post-slug' %}
    """
    try:
        app_label, model_name = app_model.split(".")
        PageModel = apps.get_model(app_label, model_name)
    except Exception:
        return "#"

    qs = PageModel.objects.live()
    if slug:
        qs = qs.filter(slug=slug)
    
    page = qs.first()  # max_count=1 ensures only one exists
    if page:
        return page.url
    return "#"
