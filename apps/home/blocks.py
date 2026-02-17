from wagtail import blocks

class CTABlock(blocks.StructBlock):
    text = blocks.CharBlock(max_length=64, required=True)
    url = blocks.URLBlock(required=True)

    class Meta:
        icon = 'link'
        label = 'CTA'
