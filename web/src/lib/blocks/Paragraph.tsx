import type { ParagraphBlock } from '$lib/types';
import EmojiText from '$lib/blocks/EmojiText';

export default function Paragraph({ block }: { block: ParagraphBlock }) {
    return (
        <div className="text-base leading-relaxed text-foreground/80">
            <EmojiText html={block.value} />
        </div>
    );
}
