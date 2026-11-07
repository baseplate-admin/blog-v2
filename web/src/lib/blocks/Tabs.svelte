<script lang="ts">
	import Icon from "$lib/Icon.svelte";
	import { Tabs, TabsContent, TabsList, TabsTrigger } from "$lib/components/ui/tabs";
	import type { TabsBlock } from "$lib/types";

	let { block }: { block: TabsBlock } = $props();

	const tabs = $derived(block.value.tabs);
	const tabIds = $derived(tabs.map((_, i) => `tab-${i}`));
</script>

<div class="my-8">
	<Tabs value={tabIds[0]} class="w-full">
		<TabsList class="h-auto flex-wrap justify-start gap-1">
			{#each tabs as tab, i (tab.title)}
				<TabsTrigger value={tabIds[i]} class="gap-1.5">
					{#if tab.icon}
						<Icon name={tab.icon} class="size-4" />
					{/if}
					{tab.title}
				</TabsTrigger>
			{/each}
		</TabsList>
		{#each tabs as tab, i (tab.title)}
			<TabsContent value={tabIds[i]} class="pt-4">
				{@html tab.content}
			</TabsContent>
		{/each}
	</Tabs>
</div>
