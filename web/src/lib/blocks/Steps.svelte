<script lang="ts">
	import AOS from "$lib/blocks/AOS.svelte";
	import type { StepsBlock } from "$lib/types";

	let { block }: { block: StepsBlock } = $props();

	const steps = $derived(block.value.steps);
</script>

<ol class="my-8 space-y-6">
	{#each steps as step, i (step.title)}
		<AOS animation="fade-up" delay={i * 80}>
			<li class="flex gap-4">
				<span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-mono text-sm font-bold text-primary-foreground">
					{i + 1}
				</span>
				<div class="min-w-0 pt-1">
					<h4 class="font-semibold text-foreground">{step.title}</h4>
					{#if step.description}
						<p class="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
					{/if}
				</div>
			</li>
		</AOS>
	{/each}
</ol>
