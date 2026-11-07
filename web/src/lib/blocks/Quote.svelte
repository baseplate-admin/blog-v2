<script lang="ts">
	import AOS from "$lib/blocks/AOS.svelte";
	import Icon from "$lib/Icon.svelte";
	import type { AOSQuoteBlock } from "$lib/types";

	let { block }: { block: AOSQuoteBlock } = $props();

	const value = $derived(block.value);
</script>

<AOS animation={value.animation} delay={Number(value.delay)}>
	<figure class="my-8 border-l-2 border-primary pl-5">
		<blockquote class="text-lg italic leading-relaxed text-foreground/90">
			"{value.quote}"
		</blockquote>
		{#if value.attribution}
			<figcaption class="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
				<Icon name="feather" class="size-4 text-primary" />
				{value.attribution}
			</figcaption>
		{/if}
	</figure>
</AOS>
