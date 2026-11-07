<script lang="ts">
	import { router } from "@inertiajs/svelte";
	import Icon from "$lib/Icon.svelte";
	import { Button } from "$lib/components/ui/button";
	import { formatDate } from "$lib/utils";
	import type { ImageValue, Nav } from "$lib/types";

	let {
		title,
		description,
		github_url,
		demo_url,
		image,
		gh_full_name,
		gh_description,
		gh_stars,
		gh_forks,
		gh_language,
		gh_last_updated,
		nav,
	}: {
		title: string;
		description: string;
		github_url: string;
		demo_url: string;
		image: ImageValue | null;
		gh_full_name: string | null;
		gh_description: string | null;
		gh_stars: number | null;
		gh_forks: number | null;
		gh_language: string | null;
		gh_last_updated: string | null;
		nav: Nav;
	} = $props();

	const imageUrl = $derived(image?.url ?? null);
	const imageAlt = $derived(image?.alt ?? "");
	const lastUpdated = $derived(formatDate(gh_last_updated));

	function goBack() {
		if (history.length > 1) history.back();
		else router.get(nav.projects ?? "/projects/");
	}
</script>

<article class="container mx-auto max-w-3xl px-4 py-12 sm:px-6">
	<header class="mb-8">
		<h1 class="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl">
			{title}
		</h1>
		{#if github_url || demo_url}
			<div class="mt-6 flex flex-wrap gap-3">
				{#if github_url}
					<Button href={github_url} class="gap-2" target="_blank" rel="noopener noreferrer">
						<Icon name="github" class="size-4" />
						GitHub
					</Button>
				{/if}
				{#if demo_url}
					<Button variant="outline" href={demo_url} class="gap-2" target="_blank" rel="noopener noreferrer">
						<Icon name="external-link" class="size-4" />
						Live demo
					</Button>
				{/if}
			</div>
		{/if}
	</header>

	{#if imageUrl}
		<figure class="mb-10 overflow-hidden rounded-xl border border-border/60">
			<img src={imageUrl} alt={imageAlt} class="w-full object-cover" loading="eager" />
		</figure>
	{/if}

	{#if description}
		<div class="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:text-foreground/90 prose-a:text-primary prose-strong:text-foreground">
			{@html description}
		</div>
	{/if}

	{#if gh_full_name}
		<div class="mt-10 rounded-xl border border-border/60 bg-muted/20 p-5">
			<div class="flex items-center gap-2 font-medium text-foreground">
				<Icon name="github" class="size-4 text-primary" />
				<a href={github_url || "#"} class="hover:text-primary" target="_blank" rel="noopener noreferrer">
					{gh_full_name}
				</a>
			</div>
			{#if gh_description}
				<p class="mt-2 text-sm text-muted-foreground">{gh_description}</p>
			{/if}
			<div class="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
				{#if gh_language}
					<span class="inline-flex items-center gap-1.5">
						<Icon name="code" class="size-3.5" />
						{gh_language}
					</span>
				{/if}
				{#if gh_stars != null}
					<span class="inline-flex items-center gap-1.5">
						<Icon name="star" class="size-3.5" />
						{gh_stars}
					</span>
				{/if}
				{#if gh_forks != null}
					<span class="inline-flex items-center gap-1.5">
						<Icon name="git-branch" class="size-3.5" />
						{gh_forks}
					</span>
				{/if}
				{#if lastUpdated}
					<span class="inline-flex items-center gap-1.5">
						<Icon name="history" class="size-3.5" />
						{lastUpdated}
					</span>
				{/if}
			</div>
		</div>
	{/if}

	<div class="mt-10">
		<Button variant="ghost" size="sm" onclick={goBack} class="gap-1.5">
			<Icon name="arrow-left" class="size-4" />
			Back to projects
		</Button>
	</div>
</article>
