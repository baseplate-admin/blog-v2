<script lang="ts">
	import { Link } from "@inertiajs/svelte";
	import Icon from "$lib/Icon.svelte";
	import { Badge } from "$lib/components/ui/badge";
	import { cn } from "$lib/utils";
	import type { Nav, Site } from "$lib/types";
	import { licenseBadge } from "$lib/badges";

	let { nav, site }: { nav: Nav; site: Site } = $props();

	const year = $derived(
		site.copyright_from && site.copyright_to
			? `${site.copyright_from} - ${site.copyright_to}`
			: String(new Date().getFullYear())
	);

	const license = $derived(licenseBadge(site.license_type ?? "all_rights"));

	const links = $derived([
		{ href: nav.blog, label: "Blog" },
		{ href: nav.projects, label: "Projects" },
		{ href: nav.about, label: "About" },
		{ href: nav.contact, label: "Contact" },
	]);
</script>

<footer class="border-t border-border/60 bg-background">
	<div class="container mx-auto flex flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
		<div class="flex items-center gap-2 text-sm text-muted-foreground">
			<Icon name="sparkles" class="size-4 text-primary" />
			<span>© {year} {site.site_name}</span>
		</div>

		<nav class="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm" aria-label="Footer">
			{#each links as item (item.label)}
				{#if item.href}
					<Link href={item.href} class="text-muted-foreground transition-colors hover:text-foreground">
						{item.label}
					</Link>
				{/if}
			{/each}
		</nav>

		<Badge variant="outline" class="gap-1.5">
			<span class={cn("size-1.5 rounded-full", license.colors.dot)}></span>
			{license.label}
		</Badge>
	</div>
</footer>
