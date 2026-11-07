<script lang="ts">
	import Icon from "$lib/Icon.svelte";
	import AOS from "$lib/blocks/AOS.svelte";
	import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "$lib/components/ui/card";
	import type { CardGridBlock } from "$lib/types";

	let { block }: { block: CardGridBlock } = $props();

	const cards = $derived(block.value.cards);
	const cols = $derived.by(() => {
		if (cards.length <= 2) return "sm:grid-cols-2";
		if (cards.length <= 3) return "sm:grid-cols-3";
		return "sm:grid-cols-2 lg:grid-cols-4";
	});
</script>

<div class="my-8 grid gap-4 {cols}">
	{#each cards as card, i (card.title)}
		<AOS animation="fade-up" delay={i * 80}>
			<Card class="h-full">
				<CardHeader class="pb-3">
					<div class="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
						<Icon name={card.icon} class="size-5" />
					</div>
					<CardTitle class="text-lg">{card.title}</CardTitle>
				</CardHeader>
				<CardContent class="pt-0">
					<CardDescription class="text-sm">{card.description}</CardDescription>
				</CardContent>
			</Card>
		</AOS>
	{/each}
</div>
