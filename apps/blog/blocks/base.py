from wagtail import blocks

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
