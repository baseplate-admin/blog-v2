from __future__ import annotations

from django import template
from django.utils.safestring import mark_safe

register: template.Library = template.Library()

MOOD_COLORS: dict[str, tuple[str, str]] = {
    "tech": ("bg-violet-500/10 text-violet-400 border-violet-500/20", "bg-violet-400"),
    "personal": ("bg-sky-500/10 text-sky-400 border-sky-500/20", "bg-sky-400"),
    "politics": ("bg-red-500/10 text-red-400 border-red-500/20", "bg-red-400"),
    "tutorial": ("bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "bg-emerald-400"),
    "opinion": ("bg-amber-500/10 text-amber-400 border-amber-500/20", "bg-amber-400"),
    "announcement": ("bg-rose-500/10 text-rose-400 border-rose-500/20", "bg-rose-400"),
    "research": ("bg-indigo-500/10 text-indigo-400 border-indigo-500/20", "bg-indigo-400"),
    "review": ("bg-teal-500/10 text-teal-400 border-teal-500/20", "bg-teal-400"),
}

MOOD_LABELS: dict[str, str] = {
    "tech": "Technology",
    "personal": "Personal",
    "politics": "Politics",
    "tutorial": "Tutorial",
    "opinion": "Opinion",
    "announcement": "Announcement",
    "research": "Research",
    "review": "Review",
}

# Inline SVG icon definitions (Heroicons/Feather style, no external deps)
_ICONS: dict[str, str] = {
    "arrow-left": '<path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"/>',
    "arrow-right": '<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12h15m0 0l-6.75-6.75M19.5 12l-6.75 6.75"/>',
    "calendar": '<path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0h17.25"/>',
    "eye": '<path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>',
    "x": '<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>',
    "search": '<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"/>',
    "moon": '<path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"/>',
    "sun": '<path stroke-linecap="round" stroke-linejoin="round" d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM4.5 12a.75.75 0 01.75-.75H7.5a.75.75 0 010 1.5H5.25A.75.75 0 014.5 12zm14.25 0a.75.75 0 01.75-.75H21.75a.75.75 0 010 1.5h-2.25a.75.75 0 01-.75-.75zM12 17.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25a.75.75 0 01.75-.75zM5.636 5.636a.75.75 0 011.06 0l1.592 1.591a.75.75 0 01-1.061 1.061L5.636 6.697a.75.75 0 010-1.06zm12.728 12.728a.75.75 0 011.06 0l1.591 1.591a.75.75 0 01-1.06 1.06l-1.591-1.591a.75.75 0 010-1.06zM5.636 18.364a.75.75 0 010-1.06l1.591-1.592a.75.75 0 111.06 1.06l-1.591 1.592a.75.75 0 01-1.06 0zm12.728-12.728a.75.75 0 010-1.06l1.591-1.592a.75.75 0 111.06 1.06L19.426 5.636a.75.75 0 01-1.06 0zM9 12a3 3 0 116 0 3 3 0 01-6 0z"/>',
    "menu": '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"/>',
    "chevron-up": '<path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5"/>',
    "table-of-contents": '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12"/>',
    "github": '<path d="M12 0C5.373 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386C24 5.373 18.627 0 12 0z"/>',
    "external-link": '<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"/>',
    "code": '<path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5"/>',
    "lightning-bolt": '<path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/>',
    "shield": '<path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"/>',
    "chart-bar": '<path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/>',
    "globe": '<path stroke-linecap="round" stroke-linejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S12 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S12 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"/>',
    "puzzle-piece": '<path stroke-linecap="round" stroke-linejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.639.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .364.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.491 48.491 0 01-4.163-.3c.186 1.613.29 3.25.312 4.907a.64.64 0 01-.64.659v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.364 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.542.57a48.049 48.049 0 01-.642 4.189c1.613-.186 3.25-.29 4.907-.312a.643.643 0 00.659.64v0c0 .355-.186.676-.401.959a1.646 1.646 0 00-.349 1.003c0 1.035 1.007 1.875 2.25 1.875 1.243 0 2.25-.84 2.25-1.875 0-.364-.128-.713-.349-1.003a1.649 1.649 0 00-.401-.959v0a.64.64 0 00-.657-.643 48.491 48.491 0 00-4.163.3c.186-1.613.29-3.25.312-4.907a.64.64 0 00-.64-.659v0c-.355 0-.676.186-.959.401a1.646 1.646 0 00-1.003.349c-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.364 0 .713.128 1.003.349.283.215.604.401.959.401v0a.643.643 0 00.657-.643 48.491 48.491 0 00-.3-4.163c1.613.186 3.25.29 4.907.312a.64.64 0 00.659-.64v0z"/>',
}


@register.inclusion_tag("tags/mood_badge.html", takes_context=True)
def mood_badge(context: template.RequestContext, mood: str, extra_class: str | None = None) -> dict[str, object]:
    """Render a mood badge. Usage: {% mood_badge page.mood %}"""
    bg_class, dot_color = MOOD_COLORS.get(mood, MOOD_COLORS["tech"])
    label = MOOD_LABELS.get(mood, mood.capitalize())
    return {
        "mood_bg": bg_class,
        "mood_dot": dot_color,
        "mood_label": label,
        "extra_class": extra_class or "",
    }


@register.simple_tag
def icon(name: str, size: int = 20) -> safestring.MarkupSafe:  # type: ignore[name-defined]
    """Render an inline SVG icon. Usage: {% icon 'arrow-left' size=24 %}"""
    paths = _ICONS.get(name, "")
    if not paths:
        return mark_safe("")
    if name == "github":
        return mark_safe(
            f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
            f'viewBox="0 0 24 24" fill="currentColor">{paths}</svg>'
        )
    return mark_safe(
        f'<svg xmlns="http://www.w3.org/2000/svg" width="{size}" height="{size}" '
        f'viewBox="0 0 24 24" fill="none" stroke-width="1.5" stroke="currentColor">'
        f"{paths}</svg>"
    )
