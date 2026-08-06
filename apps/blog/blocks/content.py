from wagtail import blocks

from .base import AOSBlock


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


class SeparatorBlock(blocks.StructBlock):
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
        label = "Separator"
        template = "blog/blocks/separator.html"
        group = "Layout"
