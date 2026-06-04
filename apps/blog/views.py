from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from apps.blog.models import BlogIndexPage


def blog_page_partial(request: HttpRequest) -> HttpResponse:
    """Return blog post HTML for infinite scroll (HTMX partial response)."""
    page_num: int = int(request.GET.get("page", 1))
    tag: str | None = request.GET.get("tag", None)
    blog_index: BlogIndexPage | None = BlogIndexPage.objects.live().first()

    if not blog_index:
        return HttpResponse("")

    blogpages = blog_index.get_children().live().specific().order_by("-first_published_at")

    if tag:
        blogpages = blogpages.filter(blogpage__tags__name=tag)

    paginator: Paginator = Paginator(blogpages, 5)

    try:
        pages = paginator.page(page_num)
    except (PageNotAnInteger, EmptyPage):
        return HttpResponse("")

    return render(
        request,
        "blog/_blog_posts_partial.html",
        {
            "blogpages": pages,
            "request_tag": tag,
            "blog_index": blog_index,
        },
    )
