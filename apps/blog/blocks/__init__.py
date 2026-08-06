"""Wagtail StreamField blocks for blog pages."""

from .base import AOSBlock, AOS_EFFECTS
from .content import (
    AOSHeadingBlock,
    AOSHighlightBlock,
    AOSQuoteBlock,
    SeparatorBlock,
)
from .media import ImageBlock, MermaidBlock
from .interactive import (
    PygmentsCodeBlock,
    CalloutBlock,
    StatsGridBlock,
    CardGridBlock,
    TabsBlock,
    TimelineBlock,
    StepsBlock,
    AlertBlock,
    TooltipBlock,
    highlight_code,
    CODE_LANGUAGES,
)

__all__ = [
    # Base
    "AOSBlock",
    "AOS_EFFECTS",
    # Content
    "AOSHeadingBlock",
    "AOSHighlightBlock",
    "AOSQuoteBlock",
    "SeparatorBlock",
    # Media
    "ImageBlock",
    "MermaidBlock",
    # Interactive
    "PygmentsCodeBlock",
    "CalloutBlock",
    "StatsGridBlock",
    "CardGridBlock",
    "TabsBlock",
    "TimelineBlock",
    "StepsBlock",
    "AlertBlock",
    "TooltipBlock",
    # Helpers
    "highlight_code",
    "CODE_LANGUAGES",
]
