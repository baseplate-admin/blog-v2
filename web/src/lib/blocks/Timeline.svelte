<script lang="ts">
    import AOS from '$lib/blocks/AOS.svelte';
    import type { TimelineBlock } from '$lib/types';

    let { block }: { block: TimelineBlock } = $props();

    const items = $derived(block.value.items);
</script>

<ol class="relative my-8 ml-4 space-y-8 border-l border-border pl-8">
    {#each items as item, i (item.title)}
        <AOS animation="fade-up" delay={i * 80}>
            <li class="relative">
                <span
                    class="absolute -left-[41px] flex size-8 items-center justify-center rounded-full border border-primary/40 bg-background font-mono text-[10px] text-primary"
                >
                    {item.timestamp || '•'}
                </span>
                <h4 class="font-semibold text-foreground">{item.title}</h4>
                {#if item.description}
                    <p
                        class="mt-1 text-sm leading-relaxed text-muted-foreground"
                    >
                        {item.description}
                    </p>
                {/if}
            </li>
        </AOS>
    {/each}
</ol>
