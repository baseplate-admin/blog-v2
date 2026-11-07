<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils";

	let {
		children,
		class: className = "",
		...rest
	}: {
		children?: Snippet;
	} & HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h5 {...rest} class={cn("mb-1 font-medium leading-none tracking-tight", className)}>
	{@render children?.()}
</h5>
