<svelte:options
    customElement={{
        tag: 'custom-navbar',
        shadow: 'none',
        props: {
            blogUrl: {
                attribute: 'blog-url',
                reflect: true,
                type: 'String',
            },
            projectUrl: {
                attribute: 'project-url',
                reflect: true,
                type: 'String',
            },
        },
    }}
/>

<script lang="ts">
    import { v7 } from 'uuid';
    import { Menu, Moon, Sun, X, Search } from '@lucide/svelte';
    import { onMount } from 'svelte';
    import { normalizeProps } from '../functions/props';

    interface Props {
        blogUrl?: string | null;
        projectUrl: string | null;
    }

    let { blogUrl, projectUrl }: Props = $props();
    let isDark = $state(false);
    let mobileOpen = $state(false);
    let searchOpen = $state(false);
    let searchQuery = $state('');
    let searchResults = $state<SearchResult[]>([]);
    let searching = $state(false);
    let searchError = $state('');
    let inputEl = $state<HTMLInputElement | null>(null);

    interface SearchResult {
        id: number;
        title: string;
        seo_title?: string;
        meta: { slug: string; type: string };
        fields?: Record<string, unknown>;
    }

    const uid = v7();
    const popoverId = `popover-${uid}`;
    const anchorName = `--anchor-${uid}`;

    let currentPath = $state(window.location.pathname);
    let showSearch = $derived(currentPath === '/blog/' || currentPath === '/blog');

    $effect(() => {
        const observer = new MutationObserver(() => {
            currentPath = window.location.pathname;
        });
        observer.observe(document.body, { childList: true, subtree: true });
        return () => observer.disconnect();
    });

    onMount(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches;

        isDark =
            savedTheme === 'tanstack-dark' ||
            (!savedTheme && systemPrefersDark);
        applyTheme(isDark);

        // Keyboard shortcut: Ctrl/Cmd+K to open search
        document.addEventListener('keydown', handleKeydown);
    });

    function handleKeydown(e: KeyboardEvent) {
        const isMod = e.ctrlKey || e.metaKey;
        if (isMod && e.key === 'k') {
            e.preventDefault();
            searchOpen = true;
            setTimeout(() => inputEl?.focus(), 100);
        }
        if (e.key === 'Escape' && searchOpen) {
            searchOpen = false;
            searchQuery = '';
            searchResults = [];
        }
    }

    $effect(() => {
        applyTheme(isDark);
        localStorage.setItem(
            'theme',
            isDark ? 'tanstack-dark' : 'tanstack-light',
        );
    });

    function applyTheme(dark: boolean) {
        if (typeof document === 'undefined') return;
        const theme = dark ? 'tanstack-dark' : 'tanstack-light';
        document.documentElement.setAttribute('data-theme', theme);
        const body = document.body;
        body.classList.add('transition-colors', 'duration-300', 'min-h-screen');
        if (dark) {
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
        }
    }

    let normalizedBlogUrl = $derived(normalizeProps(blogUrl));
    let normalizedProjectUrl = $derived(normalizeProps(projectUrl));

    const mapping = $derived([
        { href: normalizedBlogUrl, description: 'Blog' },
        { href: normalizedProjectUrl, description: 'Projects' },
    ]);

    // Debounced search
    let searchTimer: ReturnType<typeof setTimeout>;

    $effect(() => {
        if (!searchQuery || searchQuery.length < 2) {
            searchResults = [];
            return;
        }
        clearTimeout(searchTimer);
        searching = true;
        searchError = '';
        searchTimer = setTimeout(() => performSearch(searchQuery), 300);
    });

    async function performSearch(query: string) {
        try {
            const res = await fetch(`/api/pages/?search=${encodeURIComponent(query)}&type=apps.blog.BlogPage`);
            if (!res.ok) throw new Error('Search failed');
            const data = await res.json();
            searchResults = data.items || [];
        } catch {
            searchError = 'Something went wrong. Try again.';
        } finally {
            searching = false;
        }
    }
</script>

<nav
    class="relative z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 transition-colors duration-300 flex justify-between items-center"
>
    <!-- Logo -->
    <a
        href="/"
        class="text-xl font-bold tracking-tight text-base-content hover:text-primary transition-colors"
    >
        The Tinkerer
    </a>

    <!-- Right Side -->
    <div class="hidden md:flex items-center gap-6">
        <a
            href="/about/"
            class="text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
        >About</a>
        {#each mapping as item}
            {#if item.href}
                <a
                    href={item.href}
                    class="text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
                >{item.description}</a>
            {/if}
        {/each}
        <a
            href="/contact/"
            class="text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
        >Contact</a>

        <!-- Search Button (only on blog index) -->
        {#if showSearch}
            <button
                class="btn btn-ghost btn-sm gap-2"
                onclick={() => { searchOpen = true; setTimeout(() => inputEl?.focus(), 100); }}
            >
                <Search class="w-4 h-4" />
                <kbd class="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-mono bg-base-200 rounded border border-base-300">
                    <span class="text-base-content/50">Ctrl</span>
                    <span class="text-base-content/60">K</span>
                </kbd>
            </button>
        {/if}

        <label
            class="relative inline-flex items-center cursor-pointer ml-2 text-base-content/70 hover:text-base-content transition-colors"
        >
            <input type="checkbox" class="sr-only peer" bind:checked={isDark} />
            <div class="w-6 h-6 flex items-center justify-center">
                {#if isDark}
                    <Moon class="w-5 h-5 text-current" />
                {:else}
                    <Sun class="w-5 h-5 text-current" />
                {/if}
            </div>
        </label>
    </div>

    <!-- Mobile: hamburger + dropdown -->
    <div class="md:hidden flex items-center gap-2">
        {#if showSearch}
            <button
                class="btn btn-ghost btn-sm gap-2"
                onclick={() => { searchOpen = true; setTimeout(() => inputEl?.focus(), 100); }}
            >
                <Search class="w-4 h-4" />
            </button>
        {/if}
        <div class="relative">
            <button
                aria-label="Toggle menu"
                class="btn btn-ghost p-2 rounded hover:bg-base-200 transition-all"
                onclick={() => (mobileOpen = !mobileOpen)}
                popovertarget={popoverId}
                style={`anchor-name:${anchorName}`}
            >
                <span class="relative inline-block w-5 h-5">
                    <Menu
                        aria-hidden="true"
                        class={`absolute inset-0 w-5 h-5 transition-all duration-200 transform ${
                            mobileOpen
                                ? 'opacity-0 scale-75 rotate-90'
                                : 'opacity-100 scale-100 rotate-0'
                        }`}
                    />
                    <X
                        aria-hidden="true"
                        class={`absolute inset-0 w-5 h-5 transition-all duration-200 transform ${
                            mobileOpen
                                ? 'opacity-100 scale-100 rotate-0'
                                : 'opacity-0 scale-75 -rotate-90'
                        }`}
                    />
                </span>
            </button>

            <ul
                class="dropdown menu w-56 rounded-box bg-base-100 border shadow-lg z-50 p-2"
                popover
                id={popoverId}
                style={`position-anchor:${anchorName}`}
            >
                <li><a href="/about/">About</a></li>
                {#each mapping as item}
                    {#if item.href}
                        <li><a href={item.href}>{item.description}</a></li>
                    {/if}
                {/each}
                <li><a href="/contact/">Contact</a></li>
                <li class="pt-2 mt-2 border-t">
                    <label class="flex items-center gap-2 cursor-pointer p-2">
                        <input type="checkbox" class="sr-only" bind:checked={isDark} />
                        <div class="w-6 h-6 flex items-center justify-center">
                            {#if isDark}
                                <Moon class="w-5 h-5 text-current" />
                            {:else}
                                <Sun class="w-5 h-5 text-current" />
                            {/if}
                        </div>
                        <span class="text-sm text-base-content/70">Theme</span>
                    </label>
                </li>
            </ul>
        </div>
    </div>
</nav>

<!-- Search Modal -->
{#if searchOpen}
    <dialog id="search-modal" class="modal modal-open animate-in fade-in transition-data">
        <div class="modal-box w-full max-w-2xl p-0 overflow-hidden shadow-2xl">
            <!-- Search Header -->
            <div class="flex items-center gap-3 px-4 py-3 border-b border-base-300">
                <Search class="w-5 h-5 text-base-content/50 shrink-0" />
                <input
                    bind:this={inputEl}
                    type="text"
                    placeholder="Search articles..."
                    class="input input-ghost flex-1 bg-transparent text-base focus:outline-none"
                    oninput={(e) => (searchQuery = (e.target as HTMLInputElement).value)}
                    onkeydown={(e) => {
                        if (e.key === 'Escape') {
                            searchOpen = false;
                            searchQuery = '';
                            searchResults = [];
                        }
                    }}
                />
                <kbd class="px-1.5 py-0.5 text-[10px] font-mono bg-base-200 rounded border border-base-300 hidden sm:inline-flex">ESC</kbd>
                <button class="btn btn-ghost btn-xs" onclick={() => { searchOpen = false; searchQuery = ''; searchResults = []; }}>Close</button>
            </div>

            <!-- Search Results -->
            <div class="max-h-[60vh] overflow-y-auto">
                {#if searching}
                    <div class="flex items-center justify-center py-12 gap-3 text-base-content/50">
                        <span class="loading loading-spinner loading-sm text-primary"></span>
                        <span class="text-sm">Searching...</span>
                    </div>
                {:else if searchError}
                    <div class="text-center py-12 text-error text-sm">{searchError}</div>
                {:else if searchResults.length > 0 && searchQuery.length >= 2}
                    <ul class="py-2">
                        {#each searchResults as result (result.id)}
                            <li>
                                <a
                                    href={`/blog/${result.meta.slug}/`}
                                    class="flex items-start gap-4 px-4 py-3 hover:bg-base-200 transition-colors group"
                                    onclick={() => { searchOpen = false; searchQuery = ''; searchResults = []; }}
                                >
                                    <Search class="w-4 h-4 text-base-content/30 mt-0.5 shrink-0 group-hover:text-primary/50 transition-colors" />
                                    <div class="min-w-0 flex-1">
                                        <div class="text-sm font-medium truncate group-hover:text-primary transition-colors">
                                            {result.seo_title ?? result.title}
                                        </div>
                                        <div class="text-xs text-base-content/40 mt-0.5">
                                            {result.meta.type} / {result.meta.slug}
                                        </div>
                                    </div>
                                </a>
                            </li>
                        {/each}
                    </ul>
                {:else if searchQuery.length >= 2}
                    <div class="text-center py-12 text-base-content/50 text-sm">
                        No articles found for "{searchQuery}"
                    </div>
                {:else}
                    <div class="text-center py-12 text-base-content/40 text-sm">
                        Type at least 2 characters to search...
                    </div>
                {/if}
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button onclick={() => { searchOpen = false; searchQuery = ''; searchResults = []; }}>close</button>
        </form>
    </dialog>
{/if}
