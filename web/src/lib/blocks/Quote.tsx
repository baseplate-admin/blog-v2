import AOS from '$lib/blocks/AOS';
import Icon from '$lib/Icon';
import EmojiText from '$lib/blocks/EmojiText';
import type { AOSQuoteBlock } from '$lib/types';

export default function Quote({ block }: { block: AOSQuoteBlock }) {
    const value = block.value;
    return (
        <AOS animation={value.animation} delay={Number(value.delay)}>
            <figure className="my-8 border-l-2 border-primary/50 bg-card/30 py-3 px-4">
                <blockquote className="text-lg italic leading-relaxed text-foreground/70">
                    &quot;
                    <EmojiText html={value.quote} />
                    &quot;
                </blockquote>
                {value.attribution && (
                    <figcaption className="mt-3 flex items-center gap-2 text-sm text-foreground/50">
                        <Icon name="feather" className="size-4 text-primary" />
                        <EmojiText html={value.attribution} />
                    </figcaption>
                )}
            </figure>
        </AOS>
    );
}
