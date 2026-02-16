<svelte:options
    customElement={{
        tag: 'table-of-contents',
        shadow: 'none',
    }}
/>

<script lang="ts">
    import { onMount, tick } from 'svelte';

    interface TocEntry {
        id: string;
        text: string;
        level: number;
    }

    let entries = $state<TocEntry[]>([]);
    let activeId = $state<string>('');
    let backUrl = $state('');

    // Read back-url attribute
    let el: HTMLElement | undefined = $state();

    onMount(async () => {
        await tick();

        // Get the back URL from the host element attribute
        const host = el?.closest('table-of-contents');
        backUrl = host?.getAttribute('data-back-url') || '/blog/';

        const article = document.getElementById('article-content');
        if (!article) return;

        const headers = article.querySelectorAll('h2, h3');

        // Build entries and assign IDs
        const items: TocEntry[] = [];
        headers.forEach((header, index) => {
            const id = header.id || 'section-' + index;
            header.id = id;
            items.push({
                id,
                text: header.textContent?.trim() || '',
                level: header.tagName === 'H3' ? 3 : 2,
            });
        });
        entries = items;

        // Also compute reading time
        const readingTimeEl = document.getElementById('reading-time');
        if (readingTimeEl) {
            const text = article.innerText || article.textContent || '';
            const words = text.trim().split(/\s+/).length;
            const mins = Math.max(1, Math.round(words / 230));
            readingTimeEl.textContent = mins + ' min read';
        }

        // Scroll spy
        const observer = new IntersectionObserver(
            (observedEntries) => {
                for (const entry of observedEntries) {
                    if (entry.isIntersecting) {
                        activeId = entry.target.id;
                    }
                }
            },
            { rootMargin: '-80px 0px -70%' },
        );

        headers.forEach((h) => observer.observe(h));

        return () => observer.disconnect();
    });

    function scrollTo(id: string) {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            history.pushState(null, '', '#' + id);
        }
    }
</script>

<div class="sticky top-8" bind:this={el}>
    <div
        class="text-[11px] font-bold text-base-content/30 uppercase tracking-[0.15em] mb-4"
    >
        Contents
    </div>
    <nav class="flex flex-col border-l border-base-content/10">
        {#each entries as entry (entry.id)}
            <button
                onclick={() => scrollTo(entry.id)}
                class="block text-left border-l-2 -ml-px transition-all duration-150 hover:text-primary cursor-pointer
                    {entry.level === 3
                    ? 'pl-6 text-[11px] py-1'
                    : 'pl-4 text-xs font-medium py-1.5'}
                    {activeId === entry.id
                    ? 'text-primary border-primary font-medium'
                    : 'text-base-content/40 border-transparent'}"
            >
                {entry.text}
            </button>
        {/each}
    </nav>
    <a
        href={backUrl}
        class="inline-flex items-center gap-1.5 mt-8 text-xs font-medium text-base-content/30 hover:text-primary transition-colors"
    >
        <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-3.5 h-3.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 19l-7-7 7-7"
            />
        </svg>
        All posts
    </a>
</div>
