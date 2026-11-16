import type { TooltipBlock } from '$lib/types';

export default function TooltipBlock({ block }: { block: TooltipBlock }) {
    const value = block.value;
    return (
        <span
            tabIndex={0}
            role="note"
            title={value.tooltip_text}
            className="cursor-help underline decoration-dotted underline-offset-4">
            {value.inner_text}
        </span>
    );
}
