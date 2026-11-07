<script lang="ts">
	import { Link } from "@inertiajs/svelte";
	import { formatDate, readingTime } from "$lib/utils";
	import Icon from "$lib/Icon.svelte";
	import MoodBadge from "$lib/components/MoodBadge.svelte";
	import LicenseBadge from "$lib/components/LicenseBadge.svelte";
	import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "$lib/components/ui/card";
	import type { BlogPageData } from "$lib/types";

	let { post, featured = false }: { post: BlogPageData; featured?: boolean } = $props();

	const cover = $derived(post.feed_image?.url ?? null);
	const coverAlt = $derived(post.feed_image?.alt ?? "");
	const coverAccent = $derived(post.feed_image?.dominant_color_hex ?? null);
	const date = $derived(formatDate(post.date));
	const readTime = $derived(readingTime(post.body));
</script>

<Link href={post.url} class="group block">
	<Card class="h-full transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/5">
		{#if cover}
			<div class="relative overflow-hidden rounded-t-xl">
				<img
					src={cover}
					alt={coverAlt}
					loading="lazy"
					class="aspect-[16/9] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
				/>
				{#if coverAccent}
					<div
						class="absolute inset-0 opacity-20 mix-blend-overlay"
						style="background: linear-gradient(to top, {coverAccent}, transparent)"
					></div>
				{/if}
			</div>
		{/if}

		<CardHeader class="pb-3">
			<div class="flex items-center justify-between gap-2">
				<MoodBadge mood={post.mood} size="sm" />
				<span class="inline-flex items-center gap-1 text-xs text-muted-foreground">
					<Icon name="calendar" class="size-3.5" />
					{date}
				</span>
			</div>
			<h3 class="text-xl font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
				{post.title}
			</h3>
			<CardDescription class="line-clamp-2 text-sm">
				{post.intro}
			</CardDescription>
		</CardHeader>

		<CardContent class="flex flex-wrap gap-1.5">
			{#each post.tags.slice(0, 3) as tag (tag)}
				<span class="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">#{tag}</span>
			{/each}
		</CardContent>

		<CardFooter class="flex items-center justify-between pt-0 text-xs text-muted-foreground">
			<span class="inline-flex items-center gap-1">
				<Icon name="clock" class="size-3.5" />
				{readTime}
			</span>
			{#if !featured}
				<LicenseBadge license={post.license_type} />
			{/if}
		</CardFooter>
	</Card>
</Link>
