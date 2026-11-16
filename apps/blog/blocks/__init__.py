"""Wagtail StreamField blocks for blog pages."""

from mixins.blocks.aos import AOS_EFFECTS, AOSBlock

from .content import (
    AOSHeadingBlock,
    AOSHighlightBlock,
    AOSQuoteBlock,
    SeparatorBlock,
)
from .interactive import (
    CODE_LANGUAGES,
    AlertBlock,
    CalloutBlock,
    CardGridBlock,
    PygmentsCodeBlock,
    StatsGridBlock,
    StepsBlock,
    TabsBlock,
    TimelineBlock,
    TooltipBlock,
    highlight_code,
)
from .media import ImageBlock, MermaidBlock

__all__ = [
    "AOS_EFFECTS",
    "CODE_LANGUAGES",
    "AOSBlock",
    "AOSHeadingBlock",
    "AOSHighlightBlock",
    "AOSQuoteBlock",
    "AlertBlock",
    "CalloutBlock",
    "CardGridBlock",
    "ImageBlock",
    "MermaidBlock",
    "PygmentsCodeBlock",
    "SeparatorBlock",
    "StatsGridBlock",
    "StepsBlock",
    "TabsBlock",
    "TimelineBlock",
    "TooltipBlock",
    "highlight_code",
]
