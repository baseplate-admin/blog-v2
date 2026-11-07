<script lang="ts">
	import { on } from "svelte/events";
	import { cn } from "$lib/utils";
	import type { TocItem } from "$lib/types";

	let { toc }: { toc: TocItem[] } = $props();

	let activeId = $state<string | null>(null);

	function headingEl(id: string): HTMLElement | null {
		return document.getElementById(id);
	}

	function updateActive() {
		if (!toc.length) return;
		let current = toc[0].id;
		for (const item of toc) {
			const el = headingEl(item.id);
			if (el && el.getBoundingClientRect().top <= 130) {
				current = item.id;
			} else {
				break;
			}
		}
		activeId = current;
	}

	// Re-runs when the toc changes; the cleanup function detaches the listeners.
	$effect(() => {
		if (!toc.length) return;
		updateActive();
		let ticking = false;
		const detachScroll = on(window, "scroll", () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(() => {
					updateActive();
					ticking = false;
				});
			}
		}, { passive: true });
		const detachResize = on(window, "resize", () => {
			if (!ticking) {
				ticking = true;
				requestAnimationFrame(() => {
					updateActive();
					ticking = false;
				});
			}
		});
		return () => {
			detachScroll();
			detachResize();
		};
	});

	function isActive(id: string): boolean {
		if (id === activeId) return true;
		// Parent H2 propagation: an active H3 also highlights its preceding H2.
		const idx = toc.findIndex((t) => t.id === id);
		const active = toc.find((t) => t.id === activeId);
		if (active && idx !== -1 && active.level === "h3" && toc[idx].level === "h2") {
			// find the h2 that precedes the active h3
			const activeIdx = toc.findIndex((t) => t.id === activeId);
			for (let i = activeIdx; i >= 0; i--) {
				if (toc[i].level === "h2") return toc[i].id === id;
			}
		}
		return false;
	}
</script>

<nav class="text-sm" aria-label="Table of contents">
	<p class="mb-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">On this page</p>
	<ul class="space-y-1 border-l border-border">
		{#each toc as item (item.id)}
			<li>
				<a
					href={"#" + item.id}
					class={cn(
						"-ml-px block border-l-2 py-1 pr-2 transition-colors",
						item.level === "h3" ? "pl-7" : "pl-3",
						isActive(item.id)
							? "border-primary font-medium text-primary"
							: "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
					)}
				>
					{item.text}
				</a>
			</li>
		{/each}
	</ul>
</nav>
