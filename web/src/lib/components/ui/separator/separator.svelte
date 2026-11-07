<script lang="ts">
	import { Separator as SeparatorPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";

	let {
		orientation = "horizontal",
		variant = "solid",
		class: className = "",
		...rest
	}: {
		orientation?: "horizontal" | "vertical";
		variant?: "line" | "dashed" | "dotted" | "solid";
	} & Record<string, string | number | boolean | undefined> = $props();
</script>

<SeparatorPrimitive.Root
	{...rest}
	class={cn(
		"shrink-0 bg-border",
		orientation === "vertical" ? "w-px h-full" : "h-px w-full",
		variant === "dashed" && "border-t border-dashed bg-transparent",
		className
	)}
/>
