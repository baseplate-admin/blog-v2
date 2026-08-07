import os

import requests
import requests_cache


class CachedSession(requests_cache.CachedSession):
    """Cached HTTP session with Redis backend for external API calls."""

    def __init__(self) -> None:
        redis_url: str = os.getenv(
            "REDIS_URL",
            f"redis://{os.getenv('REDIS_HOST', 'localhost')}:{os.getenv('REDIS_PORT', '6379')}/1",
        )
        super().__init__(
            backend="redis",
            filename=redis_url,
            expire_after=86400,  # 24 hours
        )
        self.headers.update({"User-Agent": "Blog/1.0"})


_session: CachedSession | None = None


def get_cached_session() -> CachedSession:
    """Return a global cached session instance."""
    global _session
    if _session is None:
        _session = CachedSession()
    return _session
