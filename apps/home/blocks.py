from __future__ import annotations

from wagtail import blocks


class CTABlock(blocks.StructBlock):
    text: blocks.CharBlock = blocks.CharBlock(max_length=64, required=True, help_text="Button label text.")
    url: blocks.URLBlock = blocks.URLBlock(required=True, help_text="Destination URL for this button.")

    class Meta:
        icon: str = "link"
        label: str = "CTA"
