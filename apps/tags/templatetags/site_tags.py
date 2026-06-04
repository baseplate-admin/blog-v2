from django import template

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
