<script lang="ts">
	import { cn } from "$lib/utils";
	import { moodBadge } from "$lib/badges";

	let {
		mood,
		size = "md",
		class: className = "",
	}: {
		mood: string;
		size?: "sm" | "md";
		class?: string;
	} = $props();

	const badge = $derived(moodBadge(mood));
</script>

<span
	class={cn(
		"inline-flex items-center gap-1.5 rounded-full border font-medium",
		size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs",
		badge.colors.bg,
		badge.colors.text,
		badge.colors.border,
		className
	)}
>
	<span class={cn("size-1.5 rounded-full", badge.colors.dot)}></span>
	{badge.label}
</span>
