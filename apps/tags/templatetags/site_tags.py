from django import template

register: template.Library = template.Library()

# Lucide SVG paths (stroke-based, viewBox 0 0 24 24)
ICON_PATHS: dict[str, str] = {
    'arrow-right': '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    'arrow-left': '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    'search': '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    'moon': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
    'sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
    'menu': '<path d="M4 12h16"/><path d="M4 6h16"/><path d="M4 18h16"/>',
    'x': '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    'github': '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/>',
    'external-link': '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
    'chevron-up': '<path d="m18 15-6-6-6 6"/>',
    'calendar': '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>',
    'list': '<line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3" y1="6" y2="6"/><line x1="3" x2="3" y1="12" y2="12"/><line x1="3" x2="3" y1="18" y2="18"/>',
    'lightning-bolt': '<path d="M21 13.5 8 21 5 21 10 10.5 8 3l10 1z"/>',
    'shield': '<path d="M20 13c0 5-3.5 7.5-7.6 7.81l-.4.03-.4-.03C7.5 20.5 4 18 4 13V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2Z"/>',
    'info': '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
    'code': '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    'chart-bar': '<line x1="18" x2="18" y1="20" y2="10"/><line x1="12" x2="12" y1="20" y2="4"/><line x1="6" x2="6" y1="20" y2="14"/>',
    'globe': '<circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
    'puzzle-piece': '<path d="M19.439 15.424a1 1 0 0 0-2.867-1.756 3.986 3.986 0 0 1-4.98-1.578 3.986 3.986 0 0 1-1.578-4.98A1 1 0 0 0 7.424 5.293a3.986 3.986 0 0 1-1.578 4.98 3.986 3.986 0 0 1-4.98 1.578 1 1 0 0 0-1.756 2.867 3.986 3.986 0 0 1 4.98 1.578 3.986 3.986 0 0 1 1.578 4.98 1 1 0 0 0 1.756 2.867 3.986 3.986 0 0 1-1.578 4.98 3.986 3.986 0 0 1-4.98-1.578 1 1 0 0 0-2.867 1.756 3.986 3.986 0 0 1 1.578 4.98 3.986 3.986 0 0 1 4.98 1.578 1 1 0 0 0 2.867-1.756 3.986 3.986 0 0 1-1.578-4.98 3.986 3.986 0 0 1 4.98-1.578 1 1 0 0 0 1.756-2.867Z"/>',
    'circle': '<circle cx="12" cy="12" r="4"/>',
    'bookmark': '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z"/>',
    'history': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/>',
    'message-circle': '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
    'alert-circle': '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
}


@register.inclusion_tag("tags/icon.html", takes_context=False)
def icon(name: str, size: int = 20, stroke_width: float = 2) -> dict[str, object]:
    """Render an SVG icon. Usage: {% icon "search" size=18 %}"""
    path = ICON_PATHS.get(name, '')
    return {
        'icon_path': path,
        'icon_size': size,
        'icon_stroke_width': stroke_width,
    }


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
