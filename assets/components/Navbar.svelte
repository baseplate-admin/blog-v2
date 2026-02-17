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
    import { Moon, Sun } from '@lucide/svelte';
    import { onMount } from 'svelte';

    // Explicitly define prop types for better TS support in custom elements
    interface Props {
        blogUrl?: string | null;
        projectUrl: string | null;
    }

    let { blogUrl, projectUrl }: Props = $props();
    let isDark = $state(false);

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
    <div class="flex items-center gap-6">
        <a
            href="/about/"
            class="text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
            >About</a
        >
        {#if blogUrl}
            <a
                href={blogUrl}
                class="text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
                >Blog</a
            >
        {/if}
        {#if projectUrl}
            <a
                href={projectUrl}
                class="text-sm font-medium text-base-content/70 hover:text-base-content transition-colors"
                >Projects</a
            >
        {/if}
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
</nav>
