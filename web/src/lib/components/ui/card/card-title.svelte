<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import type { Snippet } from "svelte";
	import { cn } from "$lib/utils";

	let { class: className = "", children, ...rest }: HTMLAttributes<HTMLDivElement> & { children?: Snippet } = $props();
</script>

<div
	{...rest}
	class={cn("font-semibold leading-none tracking-tight", className)}>
	{@render children?.()}
</div>
