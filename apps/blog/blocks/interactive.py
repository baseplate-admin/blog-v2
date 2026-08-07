from pygments import highlight as pygments_highlight
from pygments.formatters import HtmlFormatter
from pygments.lexers import get_lexer_by_name, ClassNotFound
from pygments.styles import get_style_by_name

from wagtail import blocks


# Language choices for code blocks derived from Pygments lexers
CODE_LANGUAGES: list[tuple[str, str]] = [
    ("python", "Python"),
    ("javascript", "JavaScript"),
    ("typescript", "TypeScript"),
    ("html", "HTML"),
    ("css", "CSS"),
    ("xml", "XML"),
    ("json", "JSON"),
    ("yaml", "YAML"),
    ("bash", "Bash"),
    ("powershell", "PowerShell"),
    ("sql", "SQL"),
    ("markdown", "Markdown"),
    ("docker", "Dockerfile"),
    ("nginx", "Nginx"),
    ("toml", "TOML"),
    ("ini", "INI"),
    ("diff", "Diff"),
    ("python3", "Python Console"),
    ("http", "HTTP"),
    ("graphql", "GraphQL"),
    ("c", "C"),
    ("cpp", "C++"),
    ("csharp", "C#"),
    ("go", "Go"),
    ("java", "Java"),
    ("kotlin", "Kotlin"),
    ("rust", "Rust"),
    ("ruby", "Ruby"),
    ("php", "PHP"),
    ("perl", "Perl"),
    ("lua", "Lua"),
    ("r", "R"),
    ("julia", "Julia"),
    ("elixir", "Elixir"),
    ("clojure", "Clojure"),
    ("haskell", "Haskell"),
    ("swift", "Swift"),
    ("scala", "Scala"),
    ("dart", "Dart"),
    ("jsx", "React JSX"),
    ("tsx", "React TSX"),
    ("vue", "Vue"),
    ("sass", "Sass"),
    ("scss", "SCSS"),
    ("less", "Less"),
    ("twig", "Twig"),
    ("django", "Django/Jinja2"),
    ("make", "Makefile"),
    ("vim", "Vim Script"),
    ("git", "Git"),
    ("protobuf", "Protocol Buffers"),
]


def highlight_code(code: str, language: str, line_numbers: bool = False) -> str:
    """Highlight code using Pygments and return safe HTML string.

    Returns class-based HTML only - no inline styles. Theme is controlled
    via Tailwind @apply rules in tailwind.css for easy swapping.
    """
    try:
        lexer = get_lexer_by_name(language, stripnl=False)
    except ClassNotFound:
        lexer = get_lexer_by_name("text", stripnl=False)

    formatter = HtmlFormatter(
        style=get_style_by_name("lovelace"),
        cssclass="code-highlight",
        linenos="table" if line_numbers else False,
        noclasses=False,
        full=False,
        title=False,
        nowrap=False,
        guess_html=True,
    )
    return pygments_highlight(code, lexer, formatter)


class PygmentsCodeBlock(blocks.StructBlock):
    """Code block with server-side syntax highlighting via Pygments."""

    language = blocks.ChoiceBlock(
        choices=CODE_LANGUAGES,
        default="python",
        help_text="Programming language for syntax highlighting.",
    )
    code = blocks.TextBlock(
        required=True,
        help_text="Code content.",
    )
    line_numbers = blocks.BooleanBlock(
        default=False,
        required=False,
        help_text="Show line numbers.",
    )
    footer_text = blocks.RichTextBlock(
        required=False,
        feature_names=["bold", "italic", "link"],
        help_text="Optional footer text displayed below the code block.",
    )

    class Meta:
        icon = "code"
        label = "Code"
        template = "blog/blocks/code_block.html"
        group = "Interactive"

    def get_context(self, value, **kwargs):
        context = super().get_context(value, **kwargs)
        # StructValue is a dict subclass - use dict key access, not getattr
        language = value.get("language") or "text"
        code = value.get("code") or ""
        line_numbers = value.get("line_numbers", False)
        footer_text = value.get("footer_text") or ""

        # Get language display name
        lang_display = language
        for lang_key, lang_label in CODE_LANGUAGES:
            if lang_key == language:
                lang_display = lang_label
                break

        context["highlighted"] = highlight_code(code, language, line_numbers)
        context["language_display"] = lang_display
        context["footer_text"] = footer_text
        return context


class CalloutBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=True)
    body = blocks.TextBlock(required=True)
    variant = blocks.ChoiceBlock(
        choices=[
            ("info", "Info"),
            ("warning", "Warning"),
            ("success", "Success"),
            ("error", "Error"),
        ],
        default="info",
        help_text="Callout style variant.",
    )

    class Meta:
        icon = "info"
        label = "Callout"
        template = "blog/blocks/callout.html"
        group = "Interactive"


class StatItemBlock(blocks.StructBlock):
    value = blocks.CharBlock(required=True, help_text="Number or short value.")
    label = blocks.CharBlock(required=True, help_text="Label below the value.")


class StatsGridBlock(blocks.StructBlock):
    stats = blocks.ListBlock(StatItemBlock(), min_num=1, max_num=6)

    class Meta:
        icon = "list"
        label = "Stats Grid"
        template = "blog/blocks/stats_grid.html"
        group = "Interactive"


class CardItemBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=True)
    description = blocks.TextBlock(required=True)
    icon = blocks.ChoiceBlock(
        choices=[
            ("code", "Code"),
            ("lightning-bolt", "Lightning"),
            ("shield", "Shield"),
            ("chart-bar", "Chart"),
            ("globe", "Globe"),
            ("puzzle-piece", "Puzzle"),
        ],
        default="code",
        help_text="Icon for this card.",
    )


class CardGridBlock(blocks.StructBlock):
    cards = blocks.ListBlock(CardItemBlock(), min_num=1, max_num=6)

    class Meta:
        icon = "table"
        label = "Card Grid"
        template = "blog/blocks/card_grid.html"
        group = "Interactive"


class TabItemBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=True, help_text="Tab label.")
    content = blocks.TextBlock(required=True, help_text="Tab panel content.")
    icon = blocks.ChoiceBlock(
        choices=[
            ("code", "Code"),
            ("lightning-bolt", "Lightning"),
            ("shield", "Shield"),
            ("chart-bar", "Chart"),
            ("globe", "Globe"),
            ("puzzle-piece", "Puzzle"),
        ],
        default="code",
        required=False,
        help_text="Optional icon for this tab.",
    )


class TabsBlock(blocks.StructBlock):
    tabs = blocks.ListBlock(
        TabItemBlock(),
        min_num=1,
        max_num=6,
        help_text="Add 1-6 tabs.",
    )
    variant = blocks.ChoiceBlock(
        choices=[("border", "Border"), ("box", "Box"), ("lift", "Lift")],
        default="border",
        help_text="Tab style variant.",
    )

    class Meta:
        icon = "bookmark"
        label = "Tabs"
        template = "blog/blocks/tabs.html"
        group = "Interactive"


class TimelineItemBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=True, help_text="Timeline item title.")
    description = blocks.TextBlock(
        required=True, help_text="Timeline item description."
    )
    timestamp = blocks.CharBlock(
        required=False,
        help_text="Date or time label (e.g. '2024', 'Q1').",
    )


class TimelineBlock(blocks.StructBlock):
    items = blocks.ListBlock(
        TimelineItemBlock(),
        min_num=2,
        max_num=10,
        help_text="Add 2-10 timeline items.",
    )
    compact = blocks.BooleanBlock(
        default=False,
        help_text="Compact layout - all items on one side.",
    )

    class Meta:
        icon = "history"
        label = "Timeline"
        template = "blog/blocks/timeline.html"
        group = "Interactive"


class StepItemBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=True, help_text="Step title.")
    description = blocks.TextBlock(required=False, help_text="Step description.")


class StepsBlock(blocks.StructBlock):
    steps = blocks.ListBlock(
        StepItemBlock(),
        min_num=2,
        max_num=8,
        help_text="Add 2-8 steps.",
    )
    active_step = blocks.IntegerBlock(
        default=1,
        help_text="Which step is currently active (1-based number).",
    )
    vertical = blocks.BooleanBlock(
        default=True,
        help_text="Vertical layout (uncheck for horizontal).",
    )

    class Meta:
        icon = "list"
        label = "Steps"
        template = "blog/blocks/steps.html"
        group = "Interactive"


class AlertBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=True, help_text="Alert title/heading.")
    message = blocks.TextBlock(required=True, help_text="Alert body message.")
    variant = blocks.ChoiceBlock(
        choices=[
            ("info", "Info"),
            ("success", "Success"),
            ("warning", "Warning"),
            ("error", "Error"),
        ],
        default="info",
        help_text="Alert color variant.",
    )

    class Meta:
        icon = "info"
        label = "Alert"
        template = "blog/blocks/alert.html"
        group = "Interactive"


class TooltipBlock(blocks.StructBlock):
    inner_text = blocks.CharBlock(
        required=True,
        help_text="The visible text or label.",
    )
    tooltip_text = blocks.CharBlock(
        required=True,
        help_text="Tooltip text shown on hover.",
    )
    placement = blocks.ChoiceBlock(
        choices=[
            ("top", "Top"),
            ("bottom", "Bottom"),
            ("left", "Left"),
            ("right", "Right"),
        ],
        default="top",
        help_text="Tooltip placement direction.",
    )
    variant = blocks.ChoiceBlock(
        choices=[
            ("default", "Default"),
            ("primary", "Primary"),
            ("secondary", "Secondary"),
            ("accent", "Accent"),
        ],
        default="default",
        help_text="Tooltip color variant.",
    )

    class Meta:
        icon = "comment"
        label = "Tooltip"
        template = "blog/blocks/tooltip.html"
        group = "Interactive"
