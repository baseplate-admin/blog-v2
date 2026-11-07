<script lang="ts">
    import { cn } from '$lib/utils';
    import AOS from '$lib/blocks/AOS.svelte';
    import Icon from '$lib/Icon.svelte';
    import type { AOSHighlightBlock } from '$lib/types';

    let { block }: { block: AOSHighlightBlock } = $props();

    const value = $derived(block.value);
    const styles: Record<string, string> = {
        default: 'border-border bg-muted/40 text-foreground',
        primary:
            'border-primary/40 bg-primary/10 text-primary-foreground dark:text-primary-foreground',
        accent: 'border-accent/40 bg-accent/10 text-accent-foreground',
    };
</script>

<AOS animation={value.animation} delay={Number(value.delay)}>
    <div
        class={cn(
            'my-8 flex items-start gap-3 rounded-xl border p-5',
            styles[value.variant] ?? styles.default,
        )}
    >
        <Icon name="sparkles" class="mt-0.5 size-5 shrink-0 text-primary" />
        <p class="text-base font-medium leading-relaxed">{value.text}</p>
    </div>
</AOS>
