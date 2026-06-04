from __future__ import annotations

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


class AOSQuoteBlock(AOSBlock):
    quote = blocks.TextBlock(required=True)
    attribution = blocks.CharBlock(required=False, help_text="Optional attribution.")

    class Meta:
        icon = "quoteleft"
        label = "Animated Quote"
        template = "blog/blocks/aos_quote.html"


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


class AOSImageBlock(AOSBlock):
    image = ImageChooserBlock(required=True)
    caption = blocks.CharBlock(required=False)

    class Meta:
        icon = "image"
        label = "Animated Image"
        template = "blog/blocks/aos_image.html"


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


class AOSStatItemBlock(blocks.StructBlock):
    value = blocks.CharBlock(required=True, help_text="Number or short value.")
    label = blocks.CharBlock(required=True, help_text="Label below the value.")


class AOSStatsGridBlock(AOSBlock):
    stats = blocks.ListBlock(AOSStatItemBlock(), min_num=1, max_num=6)

    class Meta:
        icon = "list"
        label = "Stats Grid"
        template = "blog/blocks/aos_stats_grid.html"


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
