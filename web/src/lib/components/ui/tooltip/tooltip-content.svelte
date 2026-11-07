<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	export type TooltipContentProps = TooltipPrimitive.ContentProps & {
		children?: Snippet;
	};

	let {
		children,
		class: className = "",
		side = "top",
		sideOffset = 4,
		...rest
	}: TooltipContentProps = $props();
</script>

<TooltipPrimitive.Portal>
	<TooltipPrimitive.Content
		data-slot="tooltip-content"
		{side}
		{sideOffset}
		class={cn(
			"z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md bg-foreground px-3 py-1.5 text-xs text-background shadow-md",
			className
		)}
		{...rest}>
		{@render children?.()}
		<TooltipPrimitive.Arrow class="fill-foreground" />
	</TooltipPrimitive.Content>
</TooltipPrimitive.Portal>
