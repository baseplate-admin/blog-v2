<script lang="ts">
	import { Tabs as TabsPrimitive } from "bits-ui";
	import type { Snippet } from "svelte";

	let {
		children,
		value = $bindable(""),
		...rest
	}: TabsPrimitive.RootProps & {
		children?: Snippet;
	} = $props();
</script>

<TabsPrimitive.Root bind:value {...rest}>
	{@render children?.()}
</TabsPrimitive.Root>
