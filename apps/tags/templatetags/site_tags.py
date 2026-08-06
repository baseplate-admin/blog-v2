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
    'aperture': '<circle cx="12" cy="12" r="10"/><line x1="14.31" x2="20.05" y1="5" y2="17.5"/><line x1="9.69" x2="15.43" y1="5" y2="17.5"/><line x1="12" x2="12" y1="2" y2="22"/>',
    'asterisk': '<path d="M12 6v12"/><path d="M17.38 9.34 6.62 14.66"/><path d="M17.38 14.66 6.62 9.34"/>',
    'at-sign': '<circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-4 8"/>',
    'compass': '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    'crosshair': '<circle cx="12" cy="12" r="10"/><line x1="22" x2="18" y1="12" y2="12"/><line x1="6" x2="2" y1="12" y2="12"/><line x1="12" x2="12" y1="6" y2="2"/><line x1="12" x2="12" y1="22" y2="18"/>',
    'gem': '<path d="M6 3h12l4 6-10 13L2 9Z"/><path d="M11 3 8 9l4 13 4-13-3-6"/><path d="M2 9h20"/>',
    'diamond': '<path d="M8.9 3.7 1 12l7.9 8.3 8.2-8.3-7.9-8.3z"/>',
    'hexagon': '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>',
    'minus': '<path d="M5 12h14"/>',
    'plus': '<path d="M12 5v14"/><path d="M5 12h14"/>',
    'radar': '<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v4"/><path d="M12 18v2"/><path d="M2 12h4"/><path d="M18 12h2"/>',
    'sparkles': '<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5a2 2 0 0 0 1.437 1.437l6.135 1.582a.5.5 0 0 1 0 .963L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0Z"/><path d="M20 3v4"/><path d="M22 5h-4"/>',
    'snowflake': '<path d="M2 12h20"/><path d="M12 2v20"/><path d="m20 16-4-4 4-4"/><path d="m4 8l4 4-4 4"/><path d="m16 4-4 4-4-4"/><path d="m8 20 4-4 4 4"/>',
    'target': '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    'wand': '<path d="M15 4V2"/><path d="M15 16v-2"/><path d="M8 9h2"/><path d="M20 9h2"/><path d="M17.8 11L13 13"/><path d="M17.8 13l-4.8-2"/><path d="M8.3 11l1.3-2.2"/><path d="M8.3 13l1.3-2.2"/><path d="M3 3l18 18"/>',
    'waves': '<path d="M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/><path d="M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>',
    'wind': '<path d="M12.22 2h-.01a2 2 0 0 0-1.78 1.11 4 4 0 0 1-3.44-1.35 4 4 0 0 1 3.44-1.35 2 2 0 0 0 1.78 1.11Z"/><path d="M17.22 2h-.01a2 2 0 0 0-1.78 1.11 4 4 0 0 1-3.44-1.35 4 4 0 0 1 3.44-1.35 2 2 0 0 0 1.78 1.11Z"/><path d="M2 12h12"/><path d="M2 17h10"/><path d="M2 7h7"/>',
    'flower': '<path d="M12 18c0-3-3-3-3-6s1-4 3-4 3 1 3 4-3 3-3 6Z"/><path d="M12 18c0-3 3-3 3-6s-1-4-3-4-3 1-3 4 3 3 3 6Z"/><path d="M6 12c0-3 3-3 3-6s-1-4-3-4-3 1-3 4 3 3 3 6Z"/><path d="M18 12c0-3-3-3-3-6s1-4 3-4 3 1 3 4-3 3-3 6Z"/><path d="M12 22V8"/><path d="M4.93 4.93l14.14 14.14"/>',
    'heart': '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    'infinity': '<path d="M12 12c-2-2.4-4-4-6.4-4a4.4 4.4 0 1 0 0 8.4C7.6 16.4 10 14.4 12 12c2 2.4 4.4 4.4 6.4 4.4a4.4 4.4 0 0 0 0-8.4C18.4 8 16 10 12 12Z"/>',
    'moon-star': '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/><path d="M19 2 16.87 7.13 22 9.26l-5.13 2.13L19 19l-4.87-3.13L9 19l2.13-5.13L6 9.26l5.13-2.13L9 2l4.87 3.13L19 2Z"/>',
    'star': '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    'crown': '<path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7Z"/><path d="M3 20h18"/>',
    'feather': '<path d="M20.3 13.36c.55-.52.8-1.25.63-2.03a2.1 2.1 0 0 0-1.45-1.56c-.46-.14-.96-.06-1.36.22l-.14.1a2.23 2.23 0 0 0-.66 1.6c.03.5.24.96.58 1.3l.14.14a2.15 2.15 0 0 0 1.37.58c.47 0 .93-.18 1.28-.52l.6-.84Z"/><path d="M16 16c-1.5 1.5-3 2.5-5 3-2 .5-4 0-5-1-1-1-2-3-1-5 .5-2 1.5-3.5 3-5 1.5-1.5 2.5-3 3-5 .5-2 0-4-1-5-1-1-3-2-5-1"/>',
    'droplet': '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.5-2.5-5.5C15 7 14 5.5 14 3a6 6 0 0 0-12 0c0 2.5 1 4 2.5 6.5C6 12 7 13 7 15a5 5 0 0 0 5 7Z"/>',
    'flame': '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.29.132-3.05"/>',
    'leaf': '<path d="M13 11c0-3.5-2-7-6-9 0 6-2 10-6 13 3 0 6-2 7-5Z"/><path d="M11 13c1.5-1.5 3-4 3-7"/>',
    'zap': '<polygon points="13 2 3 14 12 14 11 22 22 10 13 10 13 2"/>',
    'orbit': '<circle cx="12" cy="12" r="3"/><path d="M12 2a10 10 0 0 1 10 10"/><path d="M12 2A10 10 0 0 0 2 12"/><path d="M22 12a10 10 0 0 1-10 10"/><path d="M2 12a10 10 0 0 0 10 10"/>',
    'prism': '<path d="M6 3h12l4 12L12 21 2 15Z"/><path d="M12 21v-9"/><path d="M22 15h-9"/>',
    'cross': '<path d="M12 8v8"/><path d="M8 12h8"/><circle cx="12" cy="12" r="3"/>',
    'sunrise': '<path d="M12 2v4"/><path d="M4.93 4.93l1.41 1.41"/><path d="M2 12h4"/><path d="M1.05 18H6"/><path d="M2 18h2"/><path d="M12 14v8"/><path d="M17 18h3"/><path d="M18 14l4 4"/><path d="M12 6a5 5 0 0 0-5 5 4 4 0 0 0 8 0 5 5 0 0 0-5-5Z"/>',
    'atlas': '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
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

LICENSE_COLORS: dict[str, tuple[str, str]] = {
    "all_rights": ("bg-red-500/10 text-red-400 border-red-500/20", "bg-red-400"),
    "mit": ("bg-green-500/10 text-green-400 border-green-500/20", "bg-green-400"),
    "apache_2_0": ("bg-blue-500/10 text-blue-400 border-blue-500/20", "bg-blue-400"),
    "gpl_3": ("bg-orange-500/10 text-orange-400 border-orange-500/20", "bg-orange-400"),
    "bsd_3_clause": ("bg-cyan-500/10 text-cyan-400 border-cyan-500/20", "bg-cyan-400"),
    "cc_by": ("bg-yellow-500/10 text-yellow-400 border-yellow-500/20", "bg-yellow-400"),
    "cc_by_sa": ("bg-purple-500/10 text-purple-400 border-purple-500/20", "bg-purple-400"),
    "cc_by_nc": ("bg-pink-500/10 text-pink-400 border-pink-500/20", "bg-pink-400"),
    "cc0": ("bg-teal-500/10 text-teal-400 border-teal-500/20", "bg-teal-400"),
    "public_domain": ("bg-emerald-500/10 text-emerald-400 border-emerald-500/20", "bg-emerald-400"),
}

LICENSE_LABELS: dict[str, str] = {
    "all_rights": "All Rights Reserved",
    "mit": "MIT License",
    "apache_2_0": "Apache License 2.0",
    "gpl_3": "GNU GPL v3",
    "bsd_3_clause": "BSD 3-Clause",
    "cc_by": "CC BY 4.0",
    "cc_by_sa": "CC BY-SA 4.0",
    "cc_by_nc": "CC BY-NC 4.0",
    "cc0": "CC0 1.0",
    "public_domain": "Public Domain",
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


@register.inclusion_tag("tags/license_badge.html", takes_context=False)
def license_badge(license_key: str, extra_class: str | None = None) -> dict[str, object]:
    """Render a license badge. Usage: {% license_badge page.license_type %}"""
    bg_class, dot_color = LICENSE_COLORS.get(license_key, LICENSE_COLORS["all_rights"])
    label = LICENSE_LABELS.get(license_key, license_key.replace("_", " ").title())
    return {
        "license_bg": bg_class,
        "license_dot": dot_color,
        "license_label": label,
        "extra_class": extra_class or "",
    }
