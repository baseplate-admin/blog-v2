<script lang="ts">
	import { router } from "@inertiajs/svelte";
	import Icon from "$lib/Icon.svelte";
	import MoodBadge from "$lib/components/MoodBadge.svelte";
	import type { Nav } from "$lib/types";
	import { cn } from "$lib/utils";

	let {
		posts = [] as { url: string; title: string; intro: string; mood: string; date: string }[],
		nav,
	}: {
		posts?: { url: string; title: string; intro: string; mood: string; date: string }[];
		nav: Nav;
	} = $props();

	let query = $state("");
	let inputEl = $state<HTMLInputElement | null>(null);
	let activeIndex = $state(0);

	// Client-side instant filter over the preloaded post list (no round-trips).
	const filtered = $derived.by(() => {
		const q = query.trim().toLowerCase();
		if (!q) return posts;
		return posts.filter(
			(p) => p.title.toLowerCase().includes(q) || p.intro.toLowerCase().includes(q),
		);
	});

	const go = (url: string) => {
		void router.get(url);
	};

	const close = () => {
		history.back();
	};

	// Open + focus the input when the modal is (re)shown.
	$effect(() => {
		if (inputEl) {
			inputEl.focus();
			inputEl.select();
		}
	});

	// Reset the highlighted row when the result set changes.
	$effect(() => {
		activeIndex = 0;
	});

	const onKey = (e: KeyboardEvent) => {
		const n = filtered.length;
		if (e.key === "ArrowDown") {
			e.preventDefault();
			if (n) activeIndex = (activeIndex + 1) % n;
		} else if (e.key === "ArrowUp") {
			e.preventDefault();
			if (n) activeIndex = (activeIndex - 1 + n) % n;
		} else if (e.key === "Enter") {
			e.preventDefault();
			const target = filtered[activeIndex] ?? filtered[0];
			if (target) go(target.url);
		} else if (e.key === "Escape") {
			close();
		}
	};
</script>

<!-- backdrop -->
<button
	class="fixed inset-0 z-40 cursor-default bg-background/70 backdrop-blur-sm"
	aria-label="Close search"
	onclick={close}
	tabindex={-1}
></button>

<!-- panel -->
<div class="fixed left-1/2 top-24 z-50 flex max-h-[70svh] w-full max-w-xl -translate-x-1/2 flex-col overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl shadow-black/40 sm:top-28">
	<div class="flex items-center gap-3 border-b border-border/60 px-4">
		<Icon name="search" class="size-4 shrink-0 text-muted-foreground" />
		<input
			bind:this={inputEl}
			bind:value={query}
			type="text"
			placeholder="Search posts..."
			class="w-full bg-transparent py-4 text-sm text-foreground outline-none placeholder:text-muted-foreground"
			onkeydown={onKey}
		/>
		<span class="shrink-0 rounded border border-border/60 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">esc</span>
	</div>

	<div class="flex-1 overflow-y-auto p-2">
		{#if filtered.length}
			<ul class="flex flex-col gap-0.5">
				{#each filtered as post, i (post.url)}
					<li>
						<button
							class={cn(
									"w-full rounded-lg px-3 py-2.5 text-left transition-colors",
									i === activeIndex ? "bg-muted" : "hover:bg-muted/60"
								)}
							onclick={() => go(post.url)}
						>
							<div class="flex items-center gap-2">
								<MoodBadge mood={post.mood} size="sm" />
								<span class="truncate text-sm font-medium text-foreground">{post.title}</span>
							</div>
							{#if post.intro}
								<p class="ml-0 mt-1 line-clamp-2 text-xs text-muted-foreground">{post.intro}</p>
							{/if}
							<p class="mt-1 font-mono text-[10px] text-muted-foreground/60">{post.date}</p>
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<div class="py-10 text-center text-sm text-muted-foreground">
				{#if query}No results for "{query}"{:else}Start typing to search...{/if}
			</div>
		{/if}
	</div>
</div>
