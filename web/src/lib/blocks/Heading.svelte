<script lang="ts">
	import { cn } from "$lib/utils";
	import AOS from "$lib/blocks/AOS.svelte";
	import type { AOSHeadingBlock } from "$lib/types";

	let { block, id }: { block: AOSHeadingBlock; id?: string } = $props();

	const value = $derived(block.value);
	const headingClass = $derived.by(() => {
		let size = "text-lg sm:text-xl";
		if (value.level === "h2") size = "text-2xl sm:text-3xl";
		else if (value.level === "h3") size = "text-xl sm:text-2xl";
		return cn(
			"mt-10 mb-4 scroll-mt-24 font-semibold tracking-tight text-foreground",
			size,
		);
	});
</script>

<AOS animation={value.animation} delay={Number(value.delay)}>
	{#if value.level === "h4"}
		<h4 id={id} data-toc={id} class={headingClass}>
			{value.text}
		</h4>
	{:else if value.level === "h3"}
		<h3 id={id} data-toc={id} class={headingClass}>
			{value.text}
		</h3>
	{:else}
		<h2 id={id} data-toc={id} class={headingClass}>
			{value.text}
		</h2>
	{/if}
</AOS>
