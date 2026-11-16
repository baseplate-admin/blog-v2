import hashlib

import requests
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.http import HttpRequest, HttpResponse, HttpResponseNotFound
from django.views.decorators.cache import cache_page


@cache_page(86400)  # Cache avatar for 24 hours
def author_avatar(request: HttpRequest, id: int) -> HttpResponse:
    """Proxy Libravatar avatar through backend to prevent drive-by attacks.

    Validates content-type and size before returning image bytes.
    """
    User = get_user_model()
    try:
        author = User.objects.get(pk=id)
    except User.DoesNotExist:
        return HttpResponseNotFound()

    if not author or not author.email:
        return HttpResponseNotFound()

    email_hash: str = hashlib.sha256(author.email.lower().encode("utf-8")).hexdigest()
    avatar_url: str = f"https://seccdn.libravatar.org/avatar/{email_hash}?s=200&d=retro"

    # Check local cache first
    cache_key: str = f"avatar_{author.id}_{email_hash[:16]}"
    cached_data = cache.get(cache_key)
    if cached_data is not None:
        return HttpResponse(cached_data, content_type="image/png")

    try:
        response = requests.get(avatar_url, timeout=5)
        response.raise_for_status()

        content_type: str = response.headers.get("Content-Type", "")

        # Reject non-image responses
        if not content_type.startswith("image/"):
            return HttpResponseNotFound()

        data: bytes = response.content

        # Reject oversized images (>500KB)
        if len(data) > 500 * 1024:
            return HttpResponseNotFound()

        # Cache validated image
        cache.set(cache_key, data, 86400)
        return HttpResponse(data, content_type=content_type)

    except requests.RequestException:
        return HttpResponseNotFound()
