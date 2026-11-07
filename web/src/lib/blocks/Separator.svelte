<script lang="ts">
	import Icon from "$lib/Icon.svelte";
	import { Separator } from "$lib/components/ui/separator";
	import type { SeparatorBlock } from "$lib/types";

	let { block }: { block: SeparatorBlock } = $props();

	const style = $derived(block.value.style);
</script>

{#if style === "dots"}
	<div class="my-10 flex items-center justify-center gap-3 text-muted-foreground/60">
		<span class="h-px w-16 bg-gradient-to-r from-transparent to-border"></span>
		<span class="size-1.5 rounded-full bg-primary/60"></span>
		<span class="h-px w-16 bg-gradient-to-l from-transparent to-border"></span>
	</div>
{:else if style === "space"}
	<div class="h-10"></div>
{:else}
	<div class="my-10 flex items-center gap-4">
		<Separator class="flex-1" />
		<Icon name="gem" class="size-4 text-primary/70" />
		<Separator class="flex-1" />
	</div>
{/if}
