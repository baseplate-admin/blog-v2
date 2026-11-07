<script lang="ts">
	import { Link } from "@inertiajs/svelte";
	import Icon from "$lib/Icon.svelte";
	import Emoji from "$lib/Emoji.svelte";
	import { Button } from "$lib/components/ui/button";
	import PostCard from "$lib/components/PostCard.svelte";
	import BlockRenderer from "$lib/blocks/BlockRenderer.svelte";
	import AOS from "$lib/blocks/AOS.svelte";
	import { stripHtml } from "$lib/utils";
	import type { Block, BlogPageData, ProjectPageData, StreamBlock } from "$lib/types";

	let {
		hero_title,
		hero_subtitle = "",
		hero_ctas = [],
		latest_posts = [],
		featured_projects = [],
		body = [],
		nav,
	}: {
		hero_title: string;
		hero_subtitle?: string;
		hero_ctas?: Block<{ text: string; url: string }>[];
		latest_posts?: BlogPageData[];
		featured_projects?: ProjectPageData[];
		body?: StreamBlock[];
		nav: import("$lib/types").Nav;
	} = $props();

	const ctas = $derived(hero_ctas.map((cta) => cta.value));
</script>

<section class="relative overflow-hidden border-b border-border/60">
	<div class="grid-bg absolute inset-0 -z-10"></div>
	<div class="container mx-auto flex min-h-[70svh] flex-col justify-center px-4 py-20 sm:px-6">
		<AOS animation="fade-up">
			<p class="mb-4 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
				<Icon name="sparkles" class="size-3.5" />
				Technology · Personal · Politics
			</p>
		</AOS>
		<AOS animation="fade-up" delay={100}>
			<h1 class="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl">
				{hero_title}
			</h1>
		</AOS>
		<!-- TEMP EMOJI DEMO: remove after verifying inline-SVG render -->
		<div class="mt-4 flex items-center gap-4">
			<Emoji value="✨" class="inline h-8 w-8" />
			<Emoji value="🔥" class="inline h-8 w-8" />
			<Emoji codepoint="1f1e8-1f1f3" class="inline h-8 w-8" />
			<span class="text-sm text-muted-foreground">Twemoji as inline SVG</span>
		</div>
		{#if hero_subtitle}
			<AOS animation="fade-up" delay={200}>
				<div class="prose prose-invert mt-6 max-w-2xl text-lg text-muted-foreground">
					{@html hero_subtitle}
				</div>
			</AOS>
		{/if}
		{#if ctas.length}
			<div class="mt-8 flex flex-wrap gap-3">
				{#each ctas as cta (cta.url)}
					<Button href={cta.url} size="lg" class="gap-2">
						{cta.text}
						<Icon name="arrow-right" class="size-4" />
					</Button>
				{/each}
			</div>
		{/if}
	</div>
</section>

{#if latest_posts.length}
	<section class="container mx-auto px-4 py-16 sm:px-6">
		<div class="mb-8 flex items-end justify-between gap-4">
			<div>
				<h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Latest posts</h2>
				<p class="mt-1 text-sm text-muted-foreground">Fresh from the notebook.</p>
			</div>
			{#if nav.blog}
				<Button variant="ghost" size="sm" href={nav.blog ?? undefined} class="gap-1.5">
					View all
					<Icon name="arrow-right" class="size-4" />
				</Button>
			{/if}
		</div>
		<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
			{#each latest_posts as post, i (post.url)}
				<AOS animation="fade-up" delay={i * 80}>
					<PostCard post={post} featured />
				</AOS>
			{/each}
		</div>
	</section>
{/if}

{#if featured_projects.length}
	<section class="border-y border-border/60 bg-muted/20">
		<div class="container mx-auto px-4 py-16 sm:px-6">
			<div class="mb-8">
				<h2 class="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Featured projects</h2>
				<p class="mt-1 text-sm text-muted-foreground">Things I've built and shipped.</p>
			</div>
			<div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
				{#each featured_projects as project, i (project.url)}
					<AOS animation="fade-up" delay={i * 80}>
						<Link href={project.url} class="group block h-full">
							<div class="flex h-full flex-col justify-between gap-4 rounded-xl border border-border/60 bg-card p-6 transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/5">
								<div class="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
									<Icon name="folder" class="size-5" />
								</div>
								<div>
									<h3 class="flex items-center gap-2 font-semibold text-foreground transition-colors group-hover:text-primary">
										{project.title}
										<Icon name="arrow-up-right" class="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
									</h3>
									<p class="mt-2 line-clamp-2 text-sm text-muted-foreground">
										{project.search_description || stripHtml(project.description)}
									</p>
								</div>
							</div>
						</Link>
					</AOS>
				{/each}
			</div>
		</div>
	</section>
{/if}

{#if body.length}
	<section class="container mx-auto max-w-4xl px-4 py-16 sm:px-6">
		{#each body as block, i (i)}
			<BlockRenderer {block} />
		{/each}
	</section>
{/if}
