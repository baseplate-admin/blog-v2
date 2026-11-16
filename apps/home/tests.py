from wagtail.models import Page
from wagtail.test.utils import WagtailPageTestCase

from apps.home.models import HomePage


class HomeSetUpTests(WagtailPageTestCase):
    """Tests for the page structure created by the home migrations."""

    def test_root_create(self):
        self.assertIsNotNone(Page.objects.get(pk=1))

    def test_homepage_create(self):
        self.assertTrue(HomePage.objects.filter(slug="home").exists())


class HomeTests(WagtailPageTestCase):
    """Tests for homepage rendering through the Inertia layer."""

    def setUp(self):
        self.homepage = HomePage.objects.get(slug="home")

    def test_homepage_renders_inertia(self):
        response = self.client.get(self.homepage.url, HTTP_HOST="localhost")
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, 'data-page="app"')
