<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	export type TabsTriggerProps = TabsPrimitive.TriggerProps & {
		children?: Snippet;
	};

	let { children, class: className = "", ...rest }: TabsTriggerProps = $props();
</script>

<TabsPrimitive.Trigger
	{...rest}
	class={cn(
		"inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2.5 py-0.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow",
		className
	)}>
	{@render children?.()}
</TabsPrimitive.Trigger>
