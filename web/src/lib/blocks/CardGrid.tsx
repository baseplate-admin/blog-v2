import Icon from '$lib/Icon';
import AOS from '$lib/blocks/AOS';
import EmojiText from '$lib/blocks/EmojiText';
import type { CardGridBlock } from '$lib/types';

export default function CardGrid({ block }: { block: CardGridBlock }) {
    const cards = block.value.cards;
    const cols =
        cards.length <= 2
            ? 'sm:grid-cols-2'
            : cards.length <= 3
              ? 'sm:grid-cols-3'
              : 'sm:grid-cols-2 lg:grid-cols-4';
    return (
        <div className={`my-8 grid gap-4 ${cols}`}>
            {cards.map((card, i) => (
                <AOS key={card.title} animation="fade-up" delay={i * 80}>
                    <div className="h-full rounded-2xl border border-border bg-card/40 p-6">
                        <div className="flex flex-col">
                            <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Icon name={card.icon} className="size-5" />
                            </div>
                            <h3 className="text-lg font-semibold">{card.title}</h3>
                            <p className="mt-1 text-sm text-foreground/60"><EmojiText html={card.description} /></p>
                        </div>
                    </div>
                </AOS>
            ))}
        </div>
    );
}
