import AOS from '$lib/blocks/AOS';
import EmojiText from '$lib/blocks/EmojiText';
import type { StepsBlock } from '$lib/types';

export default function Steps({ block }: { block: StepsBlock }) {
    const steps = block.value.steps;
    return (
        <ol className="my-8 space-y-6">
            {steps.map((step, i) => (
                <li key={step.title}>
                    <AOS animation="fade-up" delay={i * 80}>
                        <div className="flex gap-4">
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
                                {i + 1}
                            </span>
                            <div className="min-w-0 pt-1">
                                <h4 className="font-semibold text-foreground">{step.title}</h4>
                                {step.description && (
                                    <div className="mt-1 text-sm leading-relaxed text-foreground/60"><EmojiText html={step.description} /></div>
                                )}
                            </div>
                        </div>
                    </AOS>
                </li>
            ))}
        </ol>
    );
}
