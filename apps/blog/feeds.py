from datetime import UTC, datetime, time

from django.contrib.syndication.views import Feed
from django.utils.html import strip_tags
from wagtail.models import Site

from apps.blog.models import BlogPage


class BlogRSSFeed(Feed):
    title: str = "The Tinkerer - Blog"
    description: str = "Thoughts on technology, personal projects, and more."

    def __init__(self) -> None:
        super().__init__()
        self._site: object = None

    def get_feed(self, obj, request):
        # Django's syndication view does not expose the request on the feed
        # instance, so resolve the site here while it is still in scope.
        self._site = Site.find_for_request(request) or Site.objects.filter(
            is_default_site=True
        ).first()
        return super().get_feed(obj, request)

    def _get_site(self) -> object:
        return self._site

    def link(self) -> str:
        return f"{self._get_site().root_url}/blog/"

    def items(self) -> list[BlogPage]:
        return BlogPage.objects.live().public().order_by("-first_published_at")[:10]

    def item_title(self, item: BlogPage) -> str:
        return item.title

    def item_description(self, item: BlogPage) -> str:
        parts: list[str] = []
        for block in item.body:
            if block.block_type == "paragraph":
                parts.append(strip_tags(block.value.source))
            elif block.block_type == "code":
                parts.append(str(block.value))
        return "\n".join(parts)[:500]

    def item_link(self, item: BlogPage) -> str:
        return f"{self._get_site().root_url}{item.url}"

    def item_pubdate(self, item: BlogPage) -> datetime:
        # Django's feed framework requires an aware datetime, while BlogPage
        # stores a plain date.
        return datetime.combine(item.date, time.min, tzinfo=UTC)

    def item_categories(self, item: BlogPage) -> tuple[str, ...]:
        return tuple(tag.name for tag in item.tags.all())
