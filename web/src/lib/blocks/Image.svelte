<script lang="ts">
	import AOS from "$lib/blocks/AOS.svelte";
	import type { ImageBlock, InlineImageBlock } from "$lib/types";

	let { block, inline = false }: { block: ImageBlock | InlineImageBlock; inline?: boolean } = $props();

	const image = $derived(block.type === "inline_image" ? block.value.image : block.value);
	const caption = $derived(block.type === "inline_image" ? block.value.caption : "");
</script>

{#if image.url}
	<figure class={inline ? "my-6" : "my-10"}>
		<AOS animation="fade-up">
			<div class="overflow-hidden rounded-xl border border-border/60">
				<img src={image.url} alt={image.alt} loading="lazy" class="w-full" />
			</div>
		</AOS>
		{#if caption}
			<figcaption class="mt-3 text-center text-sm text-muted-foreground">{caption}</figcaption>
		{/if}
	</figure>
{/if}
