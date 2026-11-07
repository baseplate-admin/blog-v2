<script lang="ts">
	import { Link } from "@inertiajs/svelte";
	import Icon from "$lib/Icon.svelte";
	import AOS from "$lib/blocks/AOS.svelte";
	import { stripHtml } from "$lib/utils";
	import type { Nav, ProjectPageData } from "$lib/types";

	let {
		intro = "",
		projects = [],
		nav,
	}: {
		intro?: string;
		projects?: ProjectPageData[];
		nav: Nav;
	} = $props();
</script>

<div class="container mx-auto max-w-5xl px-4 py-12 sm:px-6">
	<header class="mb-10">
		<h1 class="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Projects</h1>
		{#if intro}
			<div class="prose prose-invert mt-3 max-w-2xl text-base text-muted-foreground">
				{@html intro}
			</div>
		{/if}
	</header>

	{#if projects.length}
		<div class="grid gap-6 sm:grid-cols-2">
			{#each projects as project, i (project.url)}
				<AOS animation="fade-up" delay={i * 60}>
					<Link href={project.url} class="group block h-full">
						<div
							class="flex h-full flex-col justify-between gap-4 rounded-xl border border-border/60 bg-card p-6 transition-all duration-200 group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/5"
						>
							<div class="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
								<Icon name="folder" class="size-5" />
							</div>
							<div>
								<h2
									class="flex items-center gap-2 font-semibold text-foreground transition-colors group-hover:text-primary"
								>
									{project.title}
									<Icon name="arrow-up-right" class="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
								</h2>
								{#if project.description || project.search_description}
									<p class="mt-2 line-clamp-3 text-sm text-muted-foreground">
										{project.search_description || stripHtml(project.description)}
									</p>
								{/if}
							</div>
						</div>
					</Link>
				</AOS>
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed py-20 text-center">
			<Icon name="folder" class="size-8 text-muted-foreground" />
			<p class="font-medium text-foreground">No projects yet</p>
			<p class="text-sm text-muted-foreground">Check back soon.</p>
		</div>
	{/if}
</div>
