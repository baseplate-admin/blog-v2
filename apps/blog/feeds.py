
from django.contrib.syndication.views import Feed
from django.http import HttpRequest
from django.utils.html import strip_tags

from wagtail.models import Site

from apps.blog.models import BlogPage


class BlogRSSFeed(Feed):
    title: str = "The Tinkerer - Blog"
    description: str = "Thoughts on technology, personal projects, and more."

    def link(self) -> str:
        return f"{Site.find_for_request(self.request).root_url}/blog/"

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
        site = Site.find_for_request(self.request)
        return f"{site.root_url}{item.url}"

    def item_pubdate(self, item: BlogPage) -> object:
        return item.date

    def item_categories(self, item: BlogPage) -> tuple[str, ...]:
        return tuple(tag.name for tag in item.tags.all())
