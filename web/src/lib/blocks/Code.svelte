<script lang="ts">
	import Icon from "$lib/Icon.svelte";
	import type { CodeBlock } from "$lib/types";

	let { block }: { block: CodeBlock } = $props();

	const value = $derived(block.value);
	let copied = $state(false);

	async function copy() {
		try {
			await navigator.clipboard.writeText(value.code);
			copied = true;
			setTimeout(() => (copied = false), 1500);
		} catch {
			/* clipboard unavailable */
		}
	}
</script>

<div class="my-8 overflow-hidden rounded-xl border border-border/60 bg-card">
	<div class="flex items-center justify-between border-b border-border/60 bg-muted/30 px-4 py-2">
		<span class="font-mono text-xs uppercase tracking-wide text-muted-foreground">{value.language_display}</span>
		<button
			class="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
			onclick={copy}
			aria-label="Copy code"
		>
			<Icon name={copied ? "check" : "code"} class="size-3.5" />
			{copied ? "Copied!" : "Copy"}
		</button>
	</div>
	<div class="code-highlight overflow-x-auto">
		{@html value.highlighted}
	</div>
</div>
