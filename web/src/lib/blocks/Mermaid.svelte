<script lang="ts">
	import { onMount } from "svelte";
	import type { MermaidBlock } from "$lib/types";
	import type * as MermaidModule from "mermaid";

	let { block }: { block: MermaidBlock } = $props();

	const value = $derived(block.value);
	let container = $state<HTMLElement | null>(null);
	let svg = $state("");
	let error = $state<string | null>(null);
	let rendered = $state(false);

	// Mermaid is large (~2MB with cytoscape/katex). Import it only when a
	// diagram actually scrolls into view, so it never blocks first paint.
	let mermaidPromise: Promise<typeof MermaidModule> | null = null;
	function loadMermaid(): Promise<typeof MermaidModule> {
		mermaidPromise ??= import("mermaid");
		return mermaidPromise;
	}

	const doRender = async () => {
		if (rendered) return;
		rendered = true;
		try {
			const mermaid = (await loadMermaid()).default;
			mermaid.initialize({ startOnLoad: false, securityLevel: "loose", theme: value.theme as import("mermaid").MermaidConfig["theme"] });
			const { svg: out } = await mermaid.render(`mermaid-${Math.random().toString(36).slice(2)}`, value.code);
			svg = out;
		} catch (e) {
			error = e instanceof Error ? e.message : String(e);
		}
	};

	onMount(() => {
		if (!container) return;
		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					void doRender();
					observer.disconnect();
				}
			},
			{ rootMargin: "100px" },
		);
		observer.observe(container);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={container}
	class="my-8 flex justify-center overflow-x-auto rounded-xl border border-border/60 bg-card p-4"
	data-mermaid
>
	{#if !rendered && !error}
		<div class="flex items-center gap-2 text-sm text-muted-foreground">
			<span class="size-2 animate-pulse rounded-full bg-primary"></span>
			Rendering diagram...
		</div>
	{:else}
		<div class="w-full max-w-full [&>svg]:max-w-full [&>svg]:h-auto" aria-label="Mermaid diagram">
			{@html svg}
		</div>
	{/if}
	{#if error}
		<pre class="mt-2 whitespace-pre-wrap break-words text-xs text-destructive">{error}</pre>
	{/if}
</div>
