from __future__ import annotations

from django.http import HttpRequest, HttpResponse


class HtmxDetectMiddleware:
    """Expose request.is_htmx for use in templates."""

    def __init__(self, get_response: callable[HttpRequest, HttpResponse]) -> None:
        self.get_response = get_response

    def __call__(self, request: HttpRequest) -> HttpResponse:
        request.is_htmx = bool(request.META.get("HTTP_HX_REQUEST"))  # type: ignore[attr-defined]
        return self.get_response(request)
