
from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from wagtail.search import query as search_query

from apps.blog.models import BlogPage

MIN_QUERY_LEN: int = 1
MAX_RESULTS: int = 10


def search_view(request: HttpRequest) -> HttpResponse:
    """Search blog pages by title, intro and body. Returns partial for HTMX swap."""
    query_string: str = request.GET.get("q", "").strip()
    results: list[BlogPage] = []

    if query_string and len(query_string) >= MIN_QUERY_LEN:
        page_qs = BlogPage.objects.live().public().search(
            search_query.Query(query_string),
            search_fields=["title", "intro", "body"],
        )
        results = list(page_qs.specific()[:MAX_RESULTS])

    return render(
        request,
        "search/_partial/search_results.html",
        {
            "query": query_string,
            "results": results,
        },
    )
