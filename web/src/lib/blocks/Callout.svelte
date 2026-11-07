<script lang="ts">
	import { cn } from "$lib/utils";
	import Icon from "$lib/Icon.svelte";
	import AOS from "$lib/blocks/AOS.svelte";
	import type { CalloutBlock } from "$lib/types";

	let { block }: { block: CalloutBlock } = $props();

	const value = $derived(block.value);
	const variants: Record<string, { icon: string; cls: string }> = {
		info: { icon: "info", cls: "border-info/40 bg-info/10 text-info" },
		success: { icon: "check-circle", cls: "border-success/40 bg-success/10 text-success" },
		warning: { icon: "alert-circle", cls: "border-warning/40 bg-warning/10 text-warning" },
		error: { icon: "x-circle", cls: "border-destructive/40 bg-destructive/10 text-destructive" },
	};
	const v = $derived(variants[value.variant] ?? variants.info);
</script>

<AOS animation="fade-up">
	<div class={cn("my-8 flex items-start gap-3 rounded-xl border p-5", v.cls)}>
		<Icon name={v.icon} class="mt-0.5 size-5 shrink-0" />
		<div class="min-w-0">
			<p class="font-semibold text-foreground">{value.title}</p>
			<p class="mt-1 text-sm leading-relaxed text-foreground/80">{value.body}</p>
		</div>
	</div>
</AOS>
