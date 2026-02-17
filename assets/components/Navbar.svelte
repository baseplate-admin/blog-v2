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
    import { Menu, Moon, Sun, X } from '@lucide/svelte';
    import { onMount } from 'svelte';

    // Explicitly define prop types for better TS support in custom elements
    interface Props {
        blogUrl?: string | null;
        projectUrl: string | null;
    }

    let { blogUrl, projectUrl }: Props = $props();
    let isDark = $state(false);
    let mobileOpen = $state(false);

    // Initial load logic
    onMount(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches;

        isDark =
            savedTheme === 'tanstack-dark' ||
            (!savedTheme && systemPrefersDark);
        // Initial application
        applyTheme(isDark);
    });

    //  The $effect will trigger whenever isDark changes
    $effect(() => {
        applyTheme(isDark);
        localStorage.setItem(
            'theme',
            isDark ? 'tanstack-dark' : 'tanstack-light',
        );
    });

    function applyTheme(dark: boolean) {
        // Ensure this only runs in the browser
        if (typeof document === 'undefined') return;

        const theme = dark ? 'tanstack-dark' : 'tanstack-light';
        document.documentElement.setAttribute('data-theme', theme);

        // Using classList is cleaner than overwriting className
        const body = document.body;
        body.classList.add('transition-colors', 'duration-300', 'min-h-screen');

        if (dark) {
            body.classList.add('dark');
        } else {
            body.classList.remove('dark');
        }
    }

    const mapping = $derived([
        { href: blogUrl, description: `Blog` },
        { href: projectUrl, description: `Projects` },
    ]);
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
    <!-- Desktop links (visible on md and up) -->
    <div class="hidden md:flex items-center gap-6">
        <a
            href="/about/"
            class="text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
            >About</a
        >
        {#each mapping as item}
            {#if item.href}
                <a
                    href={item.href}
                    class="text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
                    >{item.description}</a
                >
            {/if}
        {/each}
        <a
            href="/contact/"
            class="text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
            >Contact</a
        >

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

    <!-- Mobile: hamburger + dropdown (visible below md) -->
    <div class="md:hidden flex items-center gap-2">
        <div class="relative">
            <button
                aria-label="Toggle menu"
                class="btn btn-ghost p-2 rounded hover:bg-base-200 transition-all"
                onclick={() => (mobileOpen = !mobileOpen)}
            >
                <span class="relative inline-block w-5 h-5">
                    <!-- Menu icon (hidden when open) -->
                    <Menu
                        aria-hidden="true"
                        class={`absolute inset-0 w-5 h-5 transition-all duration-200 transform ${
                            mobileOpen
                                ? 'opacity-0 scale-75 rotate-90'
                                : 'opacity-100 scale-100 rotate-0'
                        }`}
                    />

                    <!-- X icon (shown when open) -->
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

            {#if mobileOpen}
                <div
                    class="absolute right-0 mt-2 w-56 bg-base-100 border rounded-lg shadow-lg z-50"
                >
                    <nav class="flex flex-col p-2">
                        <a
                            href="/about/"
                            class="p-2 rounded text-sm hover:bg-base-200"
                            >About</a
                        >
                        {#each mapping as item}
                            {#if item.href}
                                <a
                                    href={item.href}
                                    class="p-2 rounded text-sm hover:bg-base-200"
                                    >{item.description}</a
                                >
                            {/if}
                        {/each}
                        <a
                            href="/contact/"
                            class="p-2 rounded text-sm hover:bg-base-200"
                            >Contact</a
                        >

                        <div class="pt-2 mt-2 border-t">
                            <label
                                class="flex items-center gap-2 cursor-pointer p-2"
                            >
                                <input
                                    type="checkbox"
                                    class="sr-only"
                                    bind:checked={isDark}
                                />
                                <div
                                    class="w-6 h-6 flex items-center justify-center"
                                >
                                    {#if isDark}
                                        <Moon class="w-5 h-5 text-current" />
                                    {:else}
                                        <Sun class="w-5 h-5 text-current" />
                                    {/if}
                                </div>
                                <span class="text-sm text-base-content/70"
                                    >Theme</span
                                >
                            </label>
                        </div>
                    </nav>
                </div>
            {/if}
        </div>
    </div>
</nav>
