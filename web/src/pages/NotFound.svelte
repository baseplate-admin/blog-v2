<script lang="ts">
	import { router } from "@inertiajs/svelte";
	import Icon from "$lib/Icon.svelte";
	import { Button } from "$lib/components/ui/button";
	import AOS from "$lib/blocks/AOS.svelte";
	import type { Nav } from "$lib/types";

	let { nav }: { nav: import("$lib/types").Nav } = $props();
</script>

<section class="container mx-auto flex min-h-[70svh] max-w-xl flex-col items-center justify-center px-4 text-center sm:px-6">
	<AOS animation="fade-up">
		<p class="font-mono text-7xl font-bold tracking-tight text-primary">404</p>
	</AOS>
	<AOS animation="fade-up" delay={100}>
		<h1 class="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">Page not found</h1>
	</AOS>
	<AOS animation="fade-up" delay={200}>
		<p class="mt-3 text-muted-foreground">
			The page you're looking for doesn't exist or was moved.
		</p>
	</AOS>
	<AOS animation="fade-up" delay={300}>
		<div class="mt-8 flex flex-wrap items-center justify-center gap-3">
			<Button onclick={() => router.get("/")} class="gap-2">
				<Icon name="arrow-left" class="size-4" />
				Back home
			</Button>
			{#if nav.blog}
				<Button variant="outline" href={nav.blog ?? undefined} class="gap-2">
					<Icon name="book-open" class="size-4" />
					Browse the blog
				</Button>
			{/if}
		</div>
	</AOS>
</section>
