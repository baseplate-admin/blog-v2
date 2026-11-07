<script lang="ts">
	import BlockRenderer from "$lib/blocks/BlockRenderer.svelte";
	import type { StreamBlock } from "$lib/types";

	let {
		title,
		body,
	}: {
		title: string;
		body?: StreamBlock[] | string;
	} = $props();
</script>

<article class="container mx-auto max-w-3xl px-4 py-16 sm:px-6">
	<h1
		class="mb-8 text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
	>
		{title}
	</h1>
	{#if Array.isArray(body)}
		{#each body as block, i (i)}
			<BlockRenderer {block} />
		{/each}
	{:else if body}
		<div
			class="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:text-foreground/90 prose-a:text-primary prose-strong:text-foreground"
		>
			{@html body}
		</div>
	{/if}
</article>
