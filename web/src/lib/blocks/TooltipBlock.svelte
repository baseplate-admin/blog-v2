<script lang="ts">
    import {
        Tooltip,
        TooltipContent,
        TooltipTrigger,
    } from '$lib/components/ui/tooltip';
    import type { TooltipBlock } from '$lib/types';

    let { block }: { block: TooltipBlock } = $props();

    const value = $derived(block.value);
    const side = $derived.by(() => {
        if (value.placement === 'bottom') return 'bottom';
        if (value.placement === 'left') return 'left';
        if (value.placement === 'right') return 'right';
        return 'top';
    });
</script>

<Tooltip>
    <TooltipTrigger>
        <span class="cursor-help underline decoration-dotted underline-offset-4"
            >{value.inner_text}</span
        >
    </TooltipTrigger>
    <TooltipContent {side}>{value.tooltip_text}</TooltipContent>
</Tooltip>
