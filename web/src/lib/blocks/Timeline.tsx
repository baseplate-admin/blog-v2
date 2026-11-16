import AOS from '$lib/blocks/AOS';
import EmojiText from '$lib/blocks/EmojiText';
import type { TimelineBlock } from '$lib/types';

export default function Timeline({ block }: { block: TimelineBlock }) {
    const items = block.value.items;
    return (
        <ol className="relative my-8 ml-4 space-y-8 border-l border-border pl-8">
            {items.map((item, i) => (
                <AOS key={item.title} animation="fade-up" delay={i * 80}>
                    <li className="relative">
                        <span className="absolute -left-[41px] flex size-8 items-center justify-center rounded-full border border-primary/40 bg-card font-mono text-[10px] text-primary">
                            {item.timestamp || '•'}
                        </span>
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        {item.description && (
                            <p className="mt-1 text-sm leading-relaxed text-foreground/60"><EmojiText html={item.description} /></p>
                        )}
                    </li>
                </AOS>
            ))}
        </ol>
    );
}
