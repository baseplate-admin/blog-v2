<script lang="ts">
	import { cn } from "$lib/utils";
	import { licenseBadge } from "$lib/badges";

	let {
		license,
		class: className = "",
	}: {
		license: string;
		class?: string;
	} = $props();

	const badge = $derived(licenseBadge(license));
</script>

<span
	class={cn(
		"inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-medium",
		badge.colors.bg,
		badge.colors.text,
		badge.colors.border,
		className
	)}
>
	<span class={cn("size-1.5 rounded-full", badge.colors.dot)}></span>
	{badge.label}
</span>
