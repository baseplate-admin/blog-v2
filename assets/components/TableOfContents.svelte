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

    let el: HTMLElement | undefined = $state();

    onMount(() => {
        tick().then(() => {
            const host = el?.closest('table-of-contents');
            backUrl = host?.getAttribute('data-back-url') || '/blog/';

            const article = document.getElementById('article-content');
            if (!article) return;

            const headers = article.querySelectorAll('h2, h3');
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

            const observer = new IntersectionObserver(
                (observedEntries) => {
                    observedEntries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            activeId = entry.target.id;
                        }
                    });
                },
                { rootMargin: '-80px 0px -70%' },
            );

            headers.forEach((h) => observer.observe(h));

            return () => observer.disconnect();
        });
    });

    function scrollTo(id: string) {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            history.pushState(null, '', '#' + id);
            activeId = id;
        }
    }
</script>

<div class="sticky top-24" bind:this={el}>
    <nav class="flex flex-col border-l border-base-300">
        {#each entries as entry (entry.id)}
            <button
                onclick={() => scrollTo(entry.id)}
                class="block text-left border-l-2 -ml-px transition-all duration-200 outline-none
                    {entry.level === 3
                    ? 'pl-6 py-1.5 text-xs'
                    : 'pl-4 py-2 text-sm font-medium'}
                    {activeId === entry.id
                    ? 'text-primary border-primary'
                    : 'text-base-content/60 border-transparent hover:text-base-content hover:border-base-300/50'}"
            >
                {entry.text}
            </button>
        {/each}
    </nav>
</div>
