<script lang="ts">
	import type { ParagraphBlock } from "$lib/types";

	let { block }: { block: ParagraphBlock } = $props();
</script>

<div
	class="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:text-foreground/90 prose-a:text-primary prose-strong:text-foreground">
	{@html block.value}
</div>
