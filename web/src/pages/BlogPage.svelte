<script lang="ts">
    import { on } from 'svelte/events';
    import { Link, router } from '@inertiajs/svelte';
    import Icon from '$lib/Icon.svelte';
    import MoodBadge from '$lib/components/MoodBadge.svelte';
    import LicenseBadge from '$lib/components/LicenseBadge.svelte';
    import Toc from '$lib/components/Toc.svelte';
    import BlockRenderer from '$lib/blocks/BlockRenderer.svelte';
    import { Button } from '$lib/components/ui/button';
    import { formatDate, readingTime } from '$lib/utils';
    import type {
        ImageValue,
        Nav,
        StreamBlock,
        TocItem,
        UserRef,
    } from '$lib/types';

    let {
        title,
        intro,
        mood,
        date,
        tags = [],
        license_type,
        feed_image,
        owner,
        first_published_at,
        last_published_at,
        body = [],
        url,
        nav,
    }: {
        title: string;
        intro: string;
        mood: string;
        date: string;
        tags?: string[];
        license_type: string;
        feed_image: ImageValue | null;
        owner: UserRef | null;
        first_published_at: string | null;
        last_published_at: string | null;
        body?: StreamBlock[];
        url: string;
        nav: Nav;
    } = $props();

    let progress = $state(0);

    const cover = $derived(feed_image?.url ?? null);
    const coverAlt = $derived(feed_image?.alt ?? '');
    const coverAccent = $derived(feed_image?.dominant_color_hex ?? null);
    const authorAvatar = $derived(owner ? `/avatar/${owner.id}/` : null);
    const formattedDate = $derived(formatDate(date));
    const readTime = $derived(readingTime(body));
    const showUpdated = $derived(
        !!first_published_at &&
            !!last_published_at &&
            first_published_at.slice(0, 10) !== last_published_at.slice(0, 10),
    );
    const updatedDate = $derived(
        showUpdated ? formatDate(last_published_at) : null,
    );
    const tagLinks = $derived(
        tags.map((name) => ({
            name,
            url: `${url}?tag=${encodeURIComponent(name)}`,
        })),
    );
    const toc = $derived.by<TocItem[]>(() =>
        body.flatMap((block, i) => {
            if (
                block.type === 'aos_heading' &&
                (block.value.level === 'h2' || block.value.level === 'h3')
            ) {
                return [
                    {
                        id: `heading-${i}`,
                        text: block.value.text,
                        level: block.value.level,
                    },
                ];
            }
            return [];
        }),
    );

    function updateProgress() {
        const doc = document.documentElement;
        const max = doc.scrollHeight - doc.clientHeight;
        progress = max > 0 ? Math.min(100, (doc.scrollTop / max) * 100) : 0;
    }

    function goBack() {
        if (history.length > 1) history.back();
        else router.get(nav.blog ?? '/blog/');
    }

    // Initial pass + passive scroll listener, detached on cleanup.
    $effect(() => {
        updateProgress();
        return on(window, 'scroll', updateProgress, { passive: true });
    });
</script>

<!-- Reading progress bar -->
<div class="fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent">
    <div
        class="h-full bg-primary transition-[width] duration-150"
        style="width: {progress}%"
    ></div>
</div>

<article class="container mx-auto max-w-3xl px-4 py-12 sm:px-6">
    <header class="mb-10">
        <div class="mb-4 flex flex-wrap items-center gap-3">
            <MoodBadge {mood} size="sm" />
            <span
                class="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
                <Icon name="calendar" class="size-3.5" />
                {formattedDate}
            </span>
            <span
                class="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
            >
                <Icon name="clock" class="size-3.5" />
                {readTime}
            </span>
            {#if showUpdated && updatedDate}
                <span
                    class="inline-flex items-center gap-1.5 text-xs text-muted-foreground"
                >
                    <Icon name="history" class="size-3.5" />
                    Updated {updatedDate}
                </span>
            {/if}
        </div>

        <h1
            class="text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl md:text-5xl"
        >
            {title}
        </h1>
        {#if intro}
            <p class="mt-4 text-lg leading-relaxed text-muted-foreground">
                {intro}
            </p>
        {/if}

        {#if tagLinks.length}
            <div class="mt-6 flex flex-wrap gap-2">
                {#each tagLinks as tag (tag.name)}
                    <Link
                        href={tag.url}
                        class="inline-flex items-center gap-1 rounded-full border border-border px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                        <Icon name="tag" class="size-3" />
                        {tag.name}
                    </Link>
                {/each}
            </div>
        {/if}
    </header>

    {#if cover}
        <figure
            class="mb-12 overflow-hidden rounded-xl border border-border/60"
        >
            {#if coverAccent}
                <div
                    class="h-1 w-full"
                    style="background: linear-gradient(90deg, {coverAccent}, transparent)"
                ></div>
            {/if}
            <img
                src={cover}
                alt={coverAlt}
                class="w-full object-cover"
                loading="eager"
            />
        </figure>
    {/if}

    <div
        class="flex gap-8 lg:grid lg:grid-cols-[minmax(0,1fr)_220px] lg:items-start"
    >
        <div class="min-w-0">
            {#each body as block, i (i)}
                <BlockRenderer
                    {block}
                    id={block.type === 'aos_heading' ? `heading-${i}` : undefined}
                />
            {/each}

            <footer class="mt-14 border-t border-border/60 pt-8">
                <div class="flex flex-wrap items-center justify-between gap-4">
                    <div class="flex items-center gap-3">
                        {#if authorAvatar}
                            <img
                                src={authorAvatar}
                                alt="Author"
                                class="size-10 rounded-full object-cover"
                                loading="lazy"
                            />
                        {:else}
                            <span
                                class="flex size-10 items-center justify-center rounded-full bg-muted text-muted-foreground"
                            >
                                <Icon name="user" class="size-5" />
                            </span>
                        {/if}
                        <div class="flex flex-col">
                            <span class="text-sm font-medium text-foreground"
                                >{owner?.username ?? 'Author'}</span
                            >
                            <LicenseBadge license={license_type} />
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onclick={goBack}
                        class="gap-1.5"
                    >
                        <Icon name="arrow-left" class="size-4" />
                        Back to blog
                    </Button>
                </div>
            </footer>
        </div>

        {#if toc.length}
            <aside class="hidden lg:block">
                <div class="sticky top-24">
                    <Toc {toc} />
                </div>
            </aside>
        {/if}
    </div>
</article>
