<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	const OFFSET: Record<string, string> = {
		"fade-up": "translate-y-8",
		"fade-down": "-translate-y-8",
		"fade-right": "-translate-x-8",
		"fade-left": "translate-x-8",
		"zoom-in": "scale-75",
		"zoom-in-up": "translate-y-6 scale-90",
		"zoom-in-down": "-translate-y-6 scale-90",
		"flip-up": "rotate-x-12 opacity-0",
		"slide-up": "translate-y-12",
	};

	let {
		animation = "fade-up",
		delay = 0,
		class: className = "",
		children,
	}: {
		animation?: string;
		delay?: number;
		class?: string;
		children: Snippet;
	} = $props();

	let visible = $state(false);
	let el = $state<HTMLElement | null>(null);

	$effect(() => {
		if (!el) return;
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setTimeout(() => (visible = true), delay);
						observer.disconnect();
					}
				}
			},
			{ threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
		);
		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={el}
	class={cn(
		"transition-all duration-700 ease-out will-change-transform",
		visible
			? "opacity-100 translate-x-0 translate-y-0 rotate-x-0 scale-100"
			: cn("opacity-0", OFFSET[animation] ?? OFFSET["fade-up"]),
		className
	)}
>
	{@render children()}
</div>
