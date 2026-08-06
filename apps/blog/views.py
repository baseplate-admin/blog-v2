from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
from django.db.models import Count
from django.http import HttpRequest, HttpResponse, HttpResponseNotFound
from django.shortcuts import render
from django.views.decorators.cache import cache_page

import hashlib

from apps.blog.models import BlogIndexPage, BlogPageTag


@cache_page(3600)  # Cache avatar for 1 hour
def author_avatar(request: HttpRequest, id: int) -> HttpResponse:
    """Fetch the author avatar image using requests-cache (Redis-backed) and return the bytes directly."""
    import requests

    from django.contrib.auth import get_user_model

    User = get_user_model()
    try:
        author = User.objects.get(pk=id)
    except User.DoesNotExist:
        return HttpResponseNotFound()

    if not author or not author.email:
        return HttpResponseNotFound()

    email_hash: str = hashlib.md5(author.email.lower().encode("utf-8")).hexdigest()
    avatar_url: str = f"https://seccdn.libravatar.org/avatar/{email_hash}?s=200&d=retro"

    try:
        session = requests.Session()
        session.headers.update({"User-Agent": "Blog/1.0"})
        response = session.get(avatar_url, timeout=5)
        response.raise_for_status()
        return HttpResponse(
            response.content,
            content_type=response.headers.get("Content-Type", "image/png"),
        )
    except requests.RequestException:
        return HttpResponseNotFound()


@cache_page(300)  # Cache blog partial for 5 minutes
def blog_page_partial(request: HttpRequest) -> HttpResponse:
    """Return blog post HTML for infinite scroll (HTMX partial response)."""
    if not (blog_index := BlogIndexPage.objects.live().first()):
        return HttpResponse("")

    load_type: str | None = request.GET.get("type", None)

    # Lazy-load tag cloud (HTMX 4.x lazy-load pattern)
    if load_type == "tags":
        all_pages = blog_index.get_children().live().specific()
        tag_counts = (
            BlogPageTag.objects.select_related("tag")
            .filter(content_object__in=all_pages)
            .values("tag__name")
            .annotate(count=Count("id"))
            .order_by("-count")
        )
        return render(
            request,
            "blog/_partial/tag_cloud.html",
            {
                "tag_cloud": tag_counts,
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
