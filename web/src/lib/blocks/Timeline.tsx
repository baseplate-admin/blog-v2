import AOS from '$lib/blocks/AOS';
import EmojiText from '$lib/blocks/EmojiText';
import type { TimelineBlock } from '$lib/types';

export default function Timeline({ block }: { block: TimelineBlock }) {
    const items = block.value.items;
    return (
        <ol className="relative my-8 ml-4 space-y-8 border-l border-border pl-8">
            {items.map((item, i) => (
                <li key={item.title} className="relative">
                    <span className="absolute -left-[41px] top-1.5 size-3 rounded-full border-2 border-background bg-primary" />
                    <AOS animation="fade-up" delay={i * 80}>
                        {item.timestamp && (
                            <div className="mb-1 font-mono text-[11px] uppercase tracking-wide text-primary/70">
                                {item.timestamp}
                            </div>
                        )}
                        <h4 className="font-semibold text-foreground">{item.title}</h4>
                        {item.description && (
                            <div className="mt-1 text-sm leading-relaxed text-foreground/60"><EmojiText html={item.description} /></div>
                        )}
                    </AOS>
                </li>
            ))}
        </ol>
    );
}
