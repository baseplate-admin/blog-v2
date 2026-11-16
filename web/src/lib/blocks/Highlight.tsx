import { cn } from '$lib/utils';
import AOS from '$lib/blocks/AOS';
import Icon from '$lib/Icon';
import EmojiText from '$lib/blocks/EmojiText';
import type { AOSHighlightBlock } from '$lib/types';

const styles: Record<string, string> = {
    default: 'border-border bg-card/40 text-foreground',
    primary: 'border-primary/40 bg-primary/10 text-foreground',
    accent: 'border-accent/40 bg-accent/10 text-foreground',
};

export default function Highlight({ block }: { block: AOSHighlightBlock }) {
    const value = block.value;
    return (
        <AOS animation={value.animation} delay={Number(value.delay)}>
            <div className={cn('my-8 flex items-start gap-3 rounded-xl border p-5', styles[value.variant] ?? styles.default)}>
                <Icon name="sparkles" className="mt-0.5 size-5 shrink-0 text-primary" />
                <div className="text-base font-medium leading-relaxed">
                    <EmojiText html={value.text} />
                </div>
            </div>
        </AOS>
    );
}
