<script lang="ts">
	import { Link, page, router } from "@inertiajs/svelte";
	import { toggleTheme } from "$lib/hooks/theme";
	import Icon from "$lib/Icon.svelte";
	import { Button } from "$lib/components/ui/button";
	import type { Nav } from "$lib/types";
	import { cn } from "$lib/utils";

	let { nav }: { nav: Nav } = $props();

	// Read once at mount; toggleTheme() flips the class and we re-read via a
	// small reactive read so the icon tracks the <html> class without effects
	// writing to state (docs: avoid effects for synchronisation).
	let isDark = $state(document.documentElement.classList.contains("dark"));

	const toggle = () => {
		toggleTheme();
		isDark = document.documentElement.classList.contains("dark");
	};

	const links = $derived([
		{ href: nav.blog, label: "Blog" },
		{ href: nav.projects, label: "Projects" },
		{ href: nav.about, label: "About" },
		{ href: nav.contact, label: "Contact" },
	]);

	const openSearch = () => {
		void router.get("/search/");
	};

	// Global Ctrl/Cmd+K opens the search modal.
	$effect(() => {
		const onKey = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				openSearch();
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	});
</script>

<header class="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
	<nav class="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6" aria-label="Main">
		<Link href="/" class="flex items-center gap-2 font-semibold text-base text-foreground hover:text-primary transition-colors">
			<Icon name="sparkles" class="text-primary size-5" />
			<span class="hidden sm:inline">The Tinkerer</span>
		</Link>

		<ul class="hidden md:flex items-center gap-1 text-sm">
			{#each links as item (item.label)}
				{#if item.href}
					<li>
						<Link
							href={item.href}
							class={cn(
								"px-3 py-2 rounded-md transition-colors",
								page.url === item.href
									? "bg-muted text-foreground font-medium"
									: "text-muted-foreground hover:text-foreground hover:bg-muted/60"
							)}
						>
							{item.label}
						</Link>
					</li>
				{/if}
			{/each}
		</ul>

		<div class="flex items-center gap-2">
			<Button variant="ghost" size="icon" onclick={openSearch} aria-label="Search">
				<Icon name="search" />
			</Button>
			<Button variant="ghost" size="icon" onclick={toggle} aria-label="Toggle theme">
				<Icon name={isDark ? "sun" : "moon"} />
			</Button>
		</div>
	</nav>
</header>
