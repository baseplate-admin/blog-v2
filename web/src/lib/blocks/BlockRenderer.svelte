<script lang="ts">
	import type { StreamBlock } from "$lib/types";

	import Paragraph from "$lib/blocks/Paragraph.svelte";
	import Heading from "$lib/blocks/Heading.svelte";
	import Quote from "$lib/blocks/Quote.svelte";
	import Highlight from "$lib/blocks/Highlight.svelte";
	import Separator from "$lib/blocks/Separator.svelte";
	import ImageBlock from "$lib/blocks/Image.svelte";
	import Mermaid from "$lib/blocks/Mermaid.svelte";
	import Code from "$lib/blocks/Code.svelte";
	import Callout from "$lib/blocks/Callout.svelte";
	import StatsGrid from "$lib/blocks/StatsGrid.svelte";
	import CardGrid from "$lib/blocks/CardGrid.svelte";
	import Tabs from "$lib/blocks/Tabs.svelte";
	import Timeline from "$lib/blocks/Timeline.svelte";
	import Steps from "$lib/blocks/Steps.svelte";
	import Alert from "$lib/blocks/Alert.svelte";
	import TooltipBlock from "$lib/blocks/TooltipBlock.svelte";

	let { block, id }: { block: StreamBlock; id?: string } = $props();
</script>

{#if block.type === "paragraph"}
	<Paragraph {block} />
{:else if block.type === "aos_heading"}
	<Heading {block} {id} />
{:else if block.type === "aos_quote"}
	<Quote {block} />
{:else if block.type === "aos_highlight"}
	<Highlight {block} />
{:else if block.type === "separator"}
	<Separator {block} />
{:else if block.type === "image" || block.type === "inline_image"}
	<ImageBlock {block} inline={block.type === "inline_image"} />
{:else if block.type === "mermaid"}
	<Mermaid {block} />
{:else if block.type === "code"}
	<Code {block} />
{:else if block.type === "callout"}
	<Callout {block} />
{:else if block.type === "stats_grid"}
	<StatsGrid {block} />
{:else if block.type === "card_grid"}
	<CardGrid {block} />
{:else if block.type === "tabs"}
	<Tabs {block} />
{:else if block.type === "timeline"}
	<Timeline {block} />
{:else if block.type === "steps"}
	<Steps {block} />
{:else if block.type === "alert"}
	<Alert {block} />
{:else if block.type === "tooltip"}
	<TooltipBlock {block} />
{:else}
	<div class="my-4 rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
		Unknown block: {block.type}
	</div>
{/if}
