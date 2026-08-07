from django.conf import settings
from django.urls import include, path, re_path
from django.contrib import admin

from wagtail.admin import urls as wagtailadmin_urls
from wagtail import urls as wagtail_urls
from wagtail.documents import urls as wagtaildocs_urls
from wagtail.contrib.sitemaps.views import sitemap
from wagtail.api.v2 import router as api_router_module
from wagtail.api.v2.views import PagesAPIViewSet
from wagtail.images.views.serve import ServeView

from apps.blog.feeds import BlogRSSFeed
from apps.blog.views import author_avatar, blog_page_partial

api_router = api_router_module.WagtailAPIRouter("api")
api_router.register_endpoint("pages", PagesAPIViewSet)

urlpatterns = [
    re_path(
        r"^images/([^/]*)/(\d*)/([^/]*)/[^/]*$",
        ServeView.as_view(action="redirect"),
        name="wagtailimages_serve",
    ),
    path("sitemap.xml", sitemap),
    path("feed/", BlogRSSFeed(), name="rss_feed"),
    path("rss/", BlogRSSFeed(), name="rss_feed"),
    path("blog/load-more/", blog_page_partial, name="blog_page_partial"),
    path("avatar/<int:id>/", author_avatar, name="author_avatar"),
    path("django-admin/", admin.site.urls),
    path("admin/", include(wagtailadmin_urls)),
    path("documents/", include(wagtaildocs_urls)),
    path("api/", api_router.urls),
    path("search/", include("apps.search.urls")),
]

if settings.DEBUG:
    from django.conf.urls.static import static
    from django.contrib.staticfiles.urls import staticfiles_urlpatterns
    from debug_toolbar.toolbar import debug_toolbar_urls

    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += debug_toolbar_urls()

urlpatterns = urlpatterns + [
    path("", include(wagtail_urls)),
]
