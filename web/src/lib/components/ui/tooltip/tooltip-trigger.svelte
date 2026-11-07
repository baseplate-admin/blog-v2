<script lang="ts">
	import { Tooltip as TooltipPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";

	export type TooltipTriggerProps = TooltipPrimitive.TriggerProps & {
		children?: Snippet;
	};

	let { children, ...rest }: TooltipTriggerProps = $props();
</script>

<TooltipPrimitive.Trigger {...rest}>
	{@render children?.()}
</TooltipPrimitive.Trigger>
