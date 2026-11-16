import type { StreamBlock } from '$lib/types';

import Paragraph from '$lib/blocks/Paragraph';
import Heading from '$lib/blocks/Heading';
import Quote from '$lib/blocks/Quote';
import Highlight from '$lib/blocks/Highlight';
import SeparatorBlock from '$lib/blocks/Separator';
import ImageBlock from '$lib/blocks/Image';
import Mermaid from '$lib/blocks/Mermaid';
import Code from '$lib/blocks/Code';
import Callout from '$lib/blocks/Callout';
import StatsGrid from '$lib/blocks/StatsGrid';
import CardGrid from '$lib/blocks/CardGrid';
import TabsBlock from '$lib/blocks/TabsBlock';
import Timeline from '$lib/blocks/Timeline';
import Steps from '$lib/blocks/Steps';
import Alert from '$lib/blocks/Alert';
import TooltipBlock from '$lib/blocks/TooltipBlock';

export default function BlockRenderer({ block, id }: { block: StreamBlock; id?: string }) {
    switch (block.type) {
        case 'paragraph':
            return <Paragraph block={block} />;
        case 'aos_heading':
            return <Heading block={block} id={id} />;
        case 'aos_quote':
            return <Quote block={block} />;
        case 'aos_highlight':
            return <Highlight block={block} />;
        case 'separator':
            return <SeparatorBlock block={block} />;
        case 'image':
        case 'inline_image':
            return <ImageBlock block={block} inline={block.type === 'inline_image'} />;
        case 'mermaid':
            return <Mermaid block={block} />;
        case 'code':
            return <Code block={block} />;
        case 'callout':
            return <Callout block={block} />;
        case 'stats_grid':
            return <StatsGrid block={block} />;
        case 'card_grid':
            return <CardGrid block={block} />;
        case 'tabs':
            return <TabsBlock block={block} />;
        case 'timeline':
            return <Timeline block={block} />;
        case 'steps':
            return <Steps block={block} />;
        case 'alert':
            return <Alert block={block} />;
        case 'tooltip':
            return <TooltipBlock block={block} />;
        default:
            return (
                <div className="my-4 rounded-lg border border-dashed p-4 text-sm text-foreground/60">
                    Unknown block: {(block as StreamBlock).type}
                </div>
            );
    }
}
