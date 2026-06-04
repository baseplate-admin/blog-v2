from __future__ import annotations

from django import template
from django.utils.safestring import mark_safe

register: template.Library = template.Library()

MOOD_COLORS: dict[str, tuple[str, str]] = {
    "tech": ("bg-violet-500/10 text-violet-400 border-violet-500/20", "violet-400"),
    "personal": ("bg-sky-500/10 text-sky-400 border-sky-500/20", "sky-400"),
    "politics": ("bg-red-500/10 text-red-400 border-red-500/20", "red-400"),
    "tutorial": ("bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "emerald-400"),
    "opinion": ("bg-amber-500/10 text-amber-400 border-amber-500/20", "amber-400"),
    "announcement": ("bg-rose-500/10 text-rose-400 border-rose-500/20", "rose-400"),
    "research": ("bg-indigo-500/10 text-indigo-400 border-indigo-500/20", "indigo-400"),
    "review": ("bg-teal-500/10 text-teal-400 border-teal-500/20", "teal-400"),
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
