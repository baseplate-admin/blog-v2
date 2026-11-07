<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils";

	let { class: className = "", children, ...rest }: HTMLAttributes<HTMLParagraphElement> & { children?: Snippet } = $props();
</script>

<p {...rest} class={cn("text-sm text-muted-foreground", className)}>
	{@render children?.()}
</p>
