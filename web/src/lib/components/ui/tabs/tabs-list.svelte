<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	export type TabsListProps = TabsPrimitive.ListProps & {
		children?: Snippet;
	};

	let { children, class: className = "", ...rest }: TabsListProps = $props();
</script>

<TabsPrimitive.List
	{...rest}
	class={cn(
		"inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground",
		className
	)}>
	{@render children?.()}
</TabsPrimitive.List>
