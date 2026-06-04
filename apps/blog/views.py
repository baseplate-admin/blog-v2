from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from apps.blog.models import BlogIndexPage


def blog_page_partial(request: HttpRequest) -> HttpResponse:
    """Return blog post HTML for infinite scroll (HTMX partial response)."""
    if not (blog_index := BlogIndexPage.objects.live().first()):
        return HttpResponse("")

    load_type: str | None = request.GET.get("type", None)

    # Lazy-load tag cloud (HTMX 4.x lazy-load pattern)
    if load_type == "tags":
        tag_cloud = blog_index.get_tag_cloud()
        return render(
            request,
            "blog/_partial/tag_cloud.html",
            {
                "tag_cloud": tag_cloud,
                "page": blog_index,
            },
        )

    page_num: int = int(request.GET.get("page", 1))
    tag: str | None = request.GET.get("tag", None)
    mood: str | None = request.GET.get("mood", None)

    blogpages = blog_index.get_children().live().specific().order_by("-first_published_at")

    if tag:
        blogpages = blogpages.filter(blogpage__tags__name=tag)
    if mood:
        blogpages = blogpages.filter(blogpage__mood=mood)

    paginator: Paginator = Paginator(blogpages, 5)

    try:
        pages = paginator.page(page_num)
    except (PageNotAnInteger, EmptyPage):
        return HttpResponse("")

    return render(
        request,
        "blog/_partial/blog_posts.html",
        {
            "blogpages": pages,
            "request_tag": tag,
            "request_mood": mood,
            "blog_index": blog_index,
        },
    )
