<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils";

	let { class: className = "", children, ...rest }: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
</script>

<div {...rest} class={cn("flex flex-col space-y-1.5 p-6", className)}>
	{@render children?.()}
</div>
