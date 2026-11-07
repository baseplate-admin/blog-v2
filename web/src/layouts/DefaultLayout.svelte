<script lang="ts">
    import type { Snippet } from 'svelte';
    import Navbar from '$lib/components/Navbar.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import type { Nav, Site, Meta } from '$lib/types';

    let {
        nav,
        site,
        meta,
        children,
    }: {
        nav: Nav;
        site: Site;
        meta: Meta;
        children?: Snippet;
    } = $props();
</script>

<svelte:head>
    <title
        >{meta.seo_title || meta.title}{meta.site_name
            ? ` - ${meta.site_name}`
            : ''}</title
    >
    {#if meta.search_description}
        <meta name="description" content={meta.search_description} />
    {/if}
    <link
        rel="alternate"
        type="application/rss+xml"
        title="RSS Feed"
        href="/feed/"
    />

    <meta property="og:title" content={meta.seo_title || meta.title} />
    {#if meta.search_description}
        <meta property="og:description" content={meta.search_description} />
    {/if}
    {#if meta.og_url}
        <meta property="og:url" content={meta.og_url} />
    {/if}
    <meta property="og:site_name" content={meta.site_name} />
    <meta property="og:type" content={meta.og_type} />
    {#if meta.og_image}
        <meta property="og:image" content={meta.og_image} />
    {/if}
    {#if meta.og_image_alt}
        <meta property="og:image:alt" content={meta.og_image_alt} />
    {/if}
    <meta
        name="twitter:card"
        content={meta.og_image ? 'summary_large_image' : 'summary'}
    />
    {#if meta.seo_title}
        <meta name="twitter:title" content={meta.seo_title} />
    {/if}
    {#if meta.search_description}
        <meta name="twitter:description" content={meta.search_description} />
    {/if}
</svelte:head>

<div class="flex min-h-svh flex-col bg-background">
    <Navbar {nav} />
    <main class="flex-1">
        {#if children}
            {@render children()}
        {/if}
    </main>
    <Footer {nav} {site} />
</div>
