
from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock

AOS_EFFECTS: list[tuple[str, str]] = [
    ("fade-up", "Fade up"),
    ("fade-down", "Fade down"),
    ("fade-right", "Fade right"),
    ("fade-left", "Fade left"),
    ("zoom-in", "Zoom in"),
    ("zoom-in-up", "Zoom in up"),
    ("zoom-in-down", "Zoom in down"),
    ("flip-up", "Flip up"),
    ("slide-up", "Slide up"),
]


class AOSBlock(blocks.StructBlock):
    """Base block with AOS animation settings."""

    animation = blocks.ChoiceBlock(
        choices=AOS_EFFECTS,
        default="fade-up",
        help_text="Scroll animation effect.",
    )
    delay = blocks.ChoiceBlock(
        choices=[
            ("0", "None"),
            ("100", "100ms"),
            ("200", "200ms"),
            ("300", "300ms"),
            ("400", "400ms"),
            ("500", "500ms"),
        ],
        default="0",
        help_text="Animation delay.",
    )

    class Meta:
        abstract = True


class AOSHeadingBlock(AOSBlock):
    text = blocks.CharBlock(required=True)
    level = blocks.ChoiceBlock(
        choices=[("h2", "Heading 2"), ("h3", "Heading 3"), ("h4", "Heading 4")],
        default="h2",
    )

    class Meta:
        icon = "title"
        label = "Animated Heading"
        template = "blog/blocks/aos_heading.html"
        group = "Content"


class AOSQuoteBlock(AOSBlock):
    quote = blocks.TextBlock(required=True)
    attribution = blocks.CharBlock(required=False, help_text="Optional attribution.")

    class Meta:
        icon = "quoteleft"
        label = "Animated Quote"
        template = "blog/blocks/aos_quote.html"
        group = "Content"


class AOSHighlightBlock(AOSBlock):
    text = blocks.TextBlock(required=True)
    variant = blocks.ChoiceBlock(
        choices=[
            ("default", "Default"),
            ("primary", "Primary"),
            ("accent", "Accent"),
        ],
        default="default",
        help_text="Color variant.",
    )

    class Meta:
        icon = "info-circle"
        label = "Animated Highlight"
        template = "blog/blocks/aos_highlight.html"
        group = "Content"


class AOSSeparatorBlock(AOSBlock):
    style = blocks.ChoiceBlock(
        choices=[
            ("line", "Line"),
            ("dots", "Dots"),
            ("space", "Space"),
        ],
        default="line",
    )

    class Meta:
        icon = "minus"
        label = "Animated Separator"
        template = "blog/blocks/aos_separator.html"
        group = "Layout"


class AOSImageBlock(AOSBlock):
    image = ImageChooserBlock(required=True)
    caption = blocks.CharBlock(required=False)

    class Meta:
        icon = "image"
        label = "Animated Image"
        template = "blog/blocks/aos_image.html"
        group = "Media"


class AOSCalloutBlock(AOSBlock):
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
        icon = "info-circle"
        label = "Callout"
        template = "blog/blocks/aos_callout.html"
        group = "Interactive"


class AOSStatItemBlock(blocks.StructBlock):
    value = blocks.CharBlock(required=True, help_text="Number or short value.")
    label = blocks.CharBlock(required=True, help_text="Label below the value.")


class AOSStatsGridBlock(AOSBlock):
    stats = blocks.ListBlock(AOSStatItemBlock(), min_num=1, max_num=6)

    class Meta:
        icon = "list"
        label = "Stats Grid"
        template = "blog/blocks/aos_stats_grid.html"
        group = "Interactive"


class AOSCardItemBlock(blocks.StructBlock):
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


class AOSCardGridBlock(AOSBlock):
    cards = blocks.ListBlock(AOSCardItemBlock(), min_num=1, max_num=6)

    class Meta:
        icon = "table"
        label = "Card Grid"
        template = "blog/blocks/aos_card_grid.html"
        group = "Interactive"


# ── DaisyUI Component Blocks ──────────────────────────────────


class AOSTabItemBlock(blocks.StructBlock):
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


class AOSTabBlock(AOSBlock):
    tabs = blocks.ListBlock(
        AOSTabItemBlock(),
        min_num=2,
        max_num=6,
        help_text="Add 2-6 tabs.",
    )
    variant = blocks.ChoiceBlock(
        choices=[("border", "Border"), ("box", "Box"), ("lift", "Lift")],
        default="border",
        help_text="Tab style variant.",
    )

    class Meta:
        icon = "bookmark"
        label = "Tab Panel"
        template = "blog/blocks/aos_tab.html"
        group = "Interactive"


class AOSTimelineItemBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=True, help_text="Timeline item title.")
    description = blocks.TextBlock(required=True, help_text="Timeline item description.")
    timestamp = blocks.CharBlock(
        required=False, help_text="Date or time label (e.g. '2024', 'Q1').",
    )


class AOSTimelineBlock(AOSBlock):
    items = blocks.ListBlock(
        AOSTimelineItemBlock(),
        min_num=2,
        max_num=10,
        help_text="Add 2-10 timeline items.",
    )
    compact = blocks.BooleanBlock(
        default=False, help_text="Compact layout - all items on one side.",
    )

    class Meta:
        icon = "history"
        label = "Timeline"
        template = "blog/blocks/aos_timeline.html"
        group = "Interactive"


class AOSStepItemBlock(blocks.StructBlock):
    title = blocks.CharBlock(required=True, help_text="Step title.")
    description = blocks.TextBlock(required=False, help_text="Step description.")


class AOSStepsBlock(AOSBlock):
    steps = blocks.ListBlock(
        AOSStepItemBlock(),
        min_num=2,
        max_num=8,
        help_text="Add 2-8 steps.",
    )
    active_step = blocks.IntegerBlock(
        default=1, help_text="Which step is currently active (1-based number).",
    )
    vertical = blocks.BooleanBlock(
        default=True, help_text="Vertical layout (uncheck for horizontal).",
    )

    class Meta:
        icon = "list"
        label = "Steps"
        template = "blog/blocks/aos_steps.html"
        group = "Interactive"


class AOSAlertBlock(AOSBlock):
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
        template = "blog/blocks/aos_alert.html"
        group = "Interactive"


class AOSMermaidBlock(AOSBlock):
    """Mermaid.js diagram block — renders flowcharts, sequence diagrams, Gantt charts, etc."""
    code = blocks.TextBlock(
        required=True,
        help_text="Mermaid diagram syntax. See mermaid.js live editor for examples.",
    )
    theme = blocks.ChoiceBlock(
        choices=[
            ("dark", "Dark"),
            ("light", "Light"),
            ("forest", "Forest"),
            ("neutral", "Neutral"),
        ],
        default="dark",
        help_text="Diagram color theme.",
    )

    class Meta:
        icon = "chart"
        label = "Mermaid Diagram"
        template = "blog/blocks/aos_mermaid.html"
        group = "Media"


class AOSTooltipWrapperBlock(blocks.StructBlock):
    inner_text = blocks.CharBlock(
        required=True, help_text="The visible text or label.",
    )
    tooltip_text = blocks.CharBlock(
        required=True, help_text="Tooltip text shown on hover.",
    )
    placement = blocks.ChoiceBlock(
        choices=[("top", "Top"), ("bottom", "Bottom"), ("left", "Left"), ("right", "Right")],
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
    animation = blocks.ChoiceBlock(
        choices=AOS_EFFECTS + [("none", "None")],
        default="fade-up",
        help_text="Scroll animation effect.",
    )
    delay = blocks.ChoiceBlock(
        choices=[
            ("0", "None"),
            ("100", "100ms"),
            ("200", "200ms"),
            ("300", "300ms"),
            ("400", "400ms"),
            ("500", "500ms"),
        ],
        default="0",
        help_text="Animation delay.",
    )

    class Meta:
        icon = "message-circle"
        label = "Tooltip"
        template = "blog/blocks/aos_tooltip.html"
        group = "Interactive"
