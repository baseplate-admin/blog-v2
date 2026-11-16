import Icon from '$lib/Icon';
import type { SeparatorBlock } from '$lib/types';

export default function SeparatorBlock({ block }: { block: SeparatorBlock }) {
    const style = block.value.style;
    if (style === 'dots') {
        return (
            <div className="my-10 flex items-center justify-center gap-3 text-foreground/40">
                <span className="h-px w-16 bg-linear-to-r from-transparent to-border" />
                <span className="size-1.5 rounded-full bg-primary/60" />
                <span className="h-px w-16 bg-linear-to-l from-transparent to-border" />
            </div>
        );
    }
    if (style === 'space') {
        return <div className="h-10" />;
    }
    return (
        <div className="my-10 flex items-center gap-4">
            <span className="flex-1 h-px bg-muted" />
            <Icon name="gem" className="size-4 text-primary/70" />
            <span className="flex-1 h-px bg-muted" />
        </div>
    );
}
