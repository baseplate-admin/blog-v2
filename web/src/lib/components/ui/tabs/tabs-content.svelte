<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	export type TabsContentProps = TabsPrimitive.ContentProps & {
		children?: Snippet;
	};

	let { children, class: className = "", ...rest }: TabsContentProps = $props();
</script>

<TabsPrimitive.Content {...rest} class={cn("mt-2 focus-visible:outline-none", className)}>
	{@render children?.()}
</TabsPrimitive.Content>
