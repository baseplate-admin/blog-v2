from apps.blog.models import BlogIndexPage

p = BlogIndexPage.objects.live().first()
blogpages = p.get_children().live().order_by("-first_published_at")
if not blogpages:
    print("No posts")
else:
    b = blogpages.first().specific
    owner_name = (
        b.owner.get_full_name()
        if getattr(b.owner, "get_full_name", None)
        else getattr(b.owner, "username", "")
    )
    html = f'<img src="{b.author_avatar_url}" alt="{owner_name}" />'
    print("repr:", repr(html))
    print("html:", html)
