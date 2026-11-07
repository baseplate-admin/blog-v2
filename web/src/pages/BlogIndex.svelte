<script lang="ts">
	import { Link, page, router } from '@inertiajs/svelte';
	import Icon from '$lib/Icon.svelte';
	import PostCard from '$lib/components/PostCard.svelte';
	import AOS from '$lib/blocks/AOS.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Card,
		CardContent,
		CardHeader,
		CardTitle,
	} from '$lib/components/ui/card';
	import { cn } from '$lib/utils';
	import { moodBadge } from '$lib/badges';
	import type {
		BlogPageData,
		MoodChoice,
		Nav,
		Paginator,
		TagCount,
	} from '$lib/types';

	let {
		intro = '',
		about = '',
		blogpages,
		tag_cloud = [],
		mood_choices = [],
		request_tag = null,
		request_mood = null,
		nav,
	}: {
		intro?: string;
		about?: string;
		blogpages?: Paginator<BlogPageData>;
		tag_cloud?: TagCount[];
		mood_choices?: MoodChoice[];
		request_tag?: string | null;
		request_mood?: string | null;
		nav: Nav;
	} = $props();

	const posts = $derived(blogpages?.items ?? []);
	const pagination = $derived(
		blogpages
			? {
					current: blogpages.number,
					total: blogpages.num_pages,
					has_next: blogpages.has_next,
					has_prev: blogpages.has_previous,
				}
			: undefined,
	);

	function filter(query: {
		tag?: string | null;
		mood?: string | null;
		page?: number;
	}) {
		const params = new URLSearchParams();
		if (query.tag) params.set('tag', query.tag);
		if (query.mood) params.set('mood', query.mood);
		if (query.page) params.set('page', String(query.page));
		const url =
			page.url + (params.toString() ? '?' + params.toString() : '');
		router.get(url, {}, { preserveScroll: true, preserveState: true });
	}
</script>

<div
    class="container mx-auto grid gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_300px]"
>
    <div class="min-w-0">
        <header class="mb-10">
            <h1
                class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
            >
                Blog
            </h1>
            {#if intro}
                <div
                    class="prose prose-invert mt-3 max-w-2xl text-base text-muted-foreground"
                >
                    {@html intro}
                </div>
            {/if}
        </header>

        <div class="space-y-8">
            {#each posts as post, i (post.url)}
                <AOS animation="fade-up" delay={Math.min(i, 4) * 60}>
                    <PostCard {post} />
                </AOS>
            {/each}
        </div>

        {#if !posts.length}
            <div
                class="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center"
            >
                <Icon name="search" class="size-8 text-muted-foreground" />
                <p class="font-medium text-foreground">No posts found</p>
                <p class="text-sm text-muted-foreground">
                    Try a different tag or mood.
                </p>
            </div>
        {/if}

        {#if pagination}
            <nav
                class="mt-10 flex items-center justify-center gap-2"
                aria-label="Pagination"
            >
                {#if pagination.has_prev}
                    <Button
                        variant="outline"
                        size="sm"
                        onclick={() =>
                            filter({
                                tag: request_tag,
                                mood: request_mood,
                                page: pagination.current - 1,
                            })}
                    >
                        <Icon name="arrow-left" class="size-4" />
                        Previous
                    </Button>
                {/if}
                <span class="px-2 text-sm text-muted-foreground"
                    >Page {pagination.current} of {pagination.total}</span
                >
                {#if pagination.has_next}
                    <Button
                        variant="outline"
                        size="sm"
                        onclick={() =>
                            filter({
                                tag: request_tag,
                                mood: request_mood,
                                page: pagination.current + 1,
                            })}
                    >
                        Next
                        <Icon name="arrow-right" class="size-4" />
                    </Button>
                {/if}
            </nav>
        {/if}
    </div>

    <aside class="space-y-6 lg:sticky lg:top-24 lg:self-start">
        {#if about}
            <Card>
                <CardHeader class="pb-3">
                    <CardTitle class="flex items-center gap-2 text-lg">
                        <Icon name="feather" class="size-5 text-primary" />
                        About
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        class="prose prose-invert max-w-none text-sm text-muted-foreground"
                    >
                        {@html about}
                    </div>
                </CardContent>
            </Card>
        {/if}

        {#if mood_choices.length}
            <Card>
                <CardHeader class="pb-3">
                    <CardTitle class="text-lg">Filter by mood</CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="flex flex-wrap gap-2">
                        <button
                            class={cn(
                                'rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                                !request_mood
                                    ? 'border-primary bg-primary text-primary-foreground'
                                    : 'border-border bg-transparent text-muted-foreground hover:text-foreground',
                            )}
                            onclick={() =>
                                filter({ tag: request_tag, mood: null })}
                        >
                            All
                        </button>
                        {#each mood_choices as [value, label] (value)}
                            {const badge = moodBadge(value)}
                            <button
                                class={cn(
                                    'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                                    request_mood === value
                                        ? badge.colors.bg +
                                              ' ' +
                                              badge.colors.text +
                                              ' ' +
                                              badge.colors.border
                                        : 'border-border text-muted-foreground hover:text-foreground',
                                )}
                                onclick={() =>
                                    filter({
                                        tag: request_tag,
                                        mood: value,
                                    })}
                            >
                                <span
                                    class={cn(
                                        'size-1.5 rounded-full',
                                        badge.colors.dot,
                                    )}
                                ></span>
                                {label}
                            </button>
                        {/each}
                    </div>
                </CardContent>
            </Card>
        {/if}

        {#if tag_cloud.length}
            <Card>
                <CardHeader class="pb-3">
                    <CardTitle class="flex items-center gap-2 text-lg">
                        <Icon name="tag" class="size-5 text-primary" />
                        Tags
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div class="flex flex-wrap gap-2">
                        {#each tag_cloud as tag (tag.tag__name)}
                            <Link
                                href={page.url +
                                    '?tag=' +
                                    encodeURIComponent(tag.tag__name)}
                                class={cn(
                                    'inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors',
                                    request_tag === tag.tag__name
                                        ? 'border-primary bg-primary text-primary-foreground'
                                        : 'border-border text-muted-foreground hover:border-primary/40 hover:text-foreground',
                                )}
                            >
                                #{tag.tag__name}
                                <span
                                    class="rounded-full bg-background/60 px-1.5 text-[10px]"
                                    >{tag.count}</span
                                >
                            </Link>
                        {/each}
                    </div>
                </CardContent>
            </Card>
        {/if}
    </aside>
</div>
