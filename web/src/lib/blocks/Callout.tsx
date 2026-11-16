import { cn } from '$lib/utils';
import Icon from '$lib/Icon';
import AOS from '$lib/blocks/AOS';
import EmojiText from '$lib/blocks/EmojiText';
import type { CalloutBlock } from '$lib/types';

const variants: Record<string, { icon: string; cls: string }> = {
    info: { icon: 'info', cls: 'border-info/40 bg-info/10' },
    success: { icon: 'check-circle', cls: 'border-success/40 bg-success/10' },
    warning: { icon: 'alert-circle', cls: 'border-warning/40 bg-warning/10' },
    error: { icon: 'x-circle', cls: 'border-error/40 bg-error/10' },
};

export default function Callout({ block }: { block: CalloutBlock }) {
    const value = block.value;
    const v = variants[value.variant] ?? variants.info;
    return (
        <AOS animation="fade-up">
            <div className={cn('my-8 flex items-start gap-3 rounded-xl border p-5', v.cls)}>
                <Icon name={v.icon} className="mt-0.5 size-5 shrink-0" />
                <div className="min-w-0">
                    <p className="font-semibold text-foreground">{value.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/80"><EmojiText html={value.body} /></p>
                </div>
            </div>
        </AOS>
    );
}
