<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils";

	let { children, class: className = "", ...rest }: {
		children?: Snippet;
	} & HTMLAttributes<HTMLDivElement> = $props();
</script>

<div {...rest} class={cn("rounded-xl border bg-card text-card-foreground shadow", className)}>
	{@render children?.()}
</div>
