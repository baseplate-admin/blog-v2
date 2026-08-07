import logging
from dataclasses import dataclass
from datetime import datetime

from django.utils import timezone

from core.requests import get_cached_session

logger: logging.Logger = logging.getLogger(__name__)

GITHUB_API_BASE: str = "https://api.github.com"


@dataclass
class GitHubRepoData:
    """Structured data fetched from the GitHub API for a repository."""

    full_name: str = ""
    description: str = ""
    stars: int = 0
    forks: int = 0
    open_issues: int = 0
    language: str = ""
    license_name: str = ""
    last_commit: str = ""
    last_updated: datetime | None = None
    homepage: str = ""
    size_kb: int = 0
    visible: bool = True
    error: str = ""


def _get_github_token() -> str | None:
    """Fetch the GitHub token from site settings."""
    try:
        from apps.site_settings.models import SiteConfigSettings
        settings = SiteConfigSettings.for_site(None)
        return settings.github_token or None
    except Exception:
        return None


def parse_github_url(url: str) -> str | None:
    """Extract owner/repo from a GitHub URL.

    Handles:
    - https://github.com/owner/repo
    - https://github.com/owner/repo/
    - https://github.com/owner/repo.git
    - github.com/owner/repo
    - owner/repo (bare format)
    """
    url = url.strip().removesuffix("/")
    if not url:
        return None

    # Remove .git suffix
    url = url.removesuffix(".git")

    # Strip protocol
    for prefix in ("https://github.com/", "http://github.com/", "github.com/"):
        if url.startswith(prefix):
            url = url.removeprefix(prefix)
            break

    # Must have owner/repo
    parts = url.split("/")
    if len(parts) == 2:
        return f"{parts[0]}/{parts[1]}"

    return None


def fetch_repo_data(repo_url: str) -> GitHubRepoData:
    """Fetch repository metadata from GitHub API.

    Uses the cached session so results are stored in Redis for 24 hours by default.
    Auth token (if configured) bumps rate limit from 60 to 1000 req/hr.
    Returns a GitHubRepoData instance with error set if fetch fails.
    """
    owner_repo: str | None = parse_github_url(repo_url)
    if not owner_repo:
        return GitHubRepoData(error="Invalid GitHub URL")

    session = get_cached_session()
    api_url: str = f"{GITHUB_API_BASE}/repos/{owner_repo}"

    # Add auth header if token is configured
    headers: dict[str, str] | None = None
    token = _get_github_token()
    if token:
        headers = {"Authorization": f"token {token}"}

    try:
        response = session.get(api_url, timeout=10, headers=headers)
        response.raise_for_status()
        data = response.json()
    except Exception as exc:
        logger.warning("Failed to fetch GitHub data for %s: %s", owner_repo, exc)
        return GitHubRepoData(error=str(exc))

    # Check if the response is an error object
    if "message" in data and "Not Found" in data.get("message", ""):
        return GitHubRepoData(error="Repository not found")

    last_push = data.get("pushed_at", "")
    parsed_date: datetime | None = None
    if last_push:
        try:
            parsed_date = timezone.make_aware(
                datetime.fromisoformat(last_push.replace("Z", "+00:00"))
            )
        except (ValueError, TypeError):
            pass

    license_info = data.get("license", {}) or {}
    return GitHubRepoData(
        full_name=data.get("full_name", ""),
        description=data.get("description", ""),
        stars=data.get("stargazers_count", 0),
        forks=data.get("forks_count", 0),
        open_issues=data.get("open_issues_count", 0),
        language=data.get("language", "") or "",
        license_name=license_info.get("spdx_id", "") or "",
        last_commit=data.get("updated_at", ""),
        last_updated=parsed_date,
        homepage=data.get("homepage", "") or "",
        size_kb=data.get("size", 0),
        visible=data.get("visibility", "public") == "public",
    )


def format_time_ago(dt: datetime | None) -> str:
    """Format a datetime as a relative time string."""
    if not dt:
        return ""
    now = timezone.now()
    delta = now - dt
    days = delta.days
    if days == 0:
        hours = delta.seconds // 3600
        if hours == 0:
            return "today"
        return f"{hours}h ago"
    if days == 1:
        return "yesterday"
    if days < 7:
        return f"{days}d ago"
    weeks = days // 7
    if weeks < 4:
        return f"{weeks}w ago"
    months = days // 30
    if months < 12:
        return f"{months}mo ago"
    years = months // 12
    return f"{years}y ago"
