<script lang="ts">
	import AOS from "$lib/blocks/AOS.svelte";
	import { Card, CardContent } from "$lib/components/ui/card";
	import type { StatsGridBlock } from "$lib/types";

	let { block }: { block: StatsGridBlock } = $props();

	const stats = $derived(block.value.stats);
</script>

<div class="my-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
	{#each stats as stat, i (stat.label)}
		<AOS animation="fade-up" delay={i * 80}>
			<Card>
				<CardContent class="flex flex-col items-center gap-1 py-6 text-center">
					<span class="text-3xl font-bold text-primary">{stat.value}</span>
					<span class="text-sm text-muted-foreground">{stat.label}</span>
				</CardContent>
			</Card>
		</AOS>
	{/each}
</div>
