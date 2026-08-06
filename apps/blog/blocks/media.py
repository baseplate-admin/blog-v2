from wagtail import blocks
from wagtail.images.blocks import ImageChooserBlock

from .base import AOSBlock


class ImageBlock(blocks.StructBlock):
    image = ImageChooserBlock(required=True)
    caption = blocks.CharBlock(required=False)

    class Meta:
        icon = "image"
        label = "Image"
        template = "blog/blocks/image.html"
        group = "Media"


class MermaidBlock(blocks.StructBlock):
    """Mermaid.js diagram block - renders flowcharts, sequence diagrams, Gantt charts, etc."""
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
        template = "blog/blocks/mermaid.html"
        group = "Media"
