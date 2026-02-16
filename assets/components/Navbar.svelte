<svelte:options
    customElement={{
        tag: 'custom-navbar',
        shadow: 'none',
    }}
/>

<script lang="ts">
    import { Moon, Sun } from '@lucide/svelte';
    import { onMount } from 'svelte';

    let isDark = $state(false);

    onMount(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia(
            '(prefers-color-scheme: dark)',
        ).matches;

        isDark =
            savedTheme === 'tanstack-dark' ||
            (!savedTheme && systemPrefersDark);

        applyTheme(isDark);
    });

    $effect(() => {
        applyTheme(isDark);
        localStorage.setItem(
            'theme',
            isDark ? 'tanstack-dark' : 'tanstack-light',
        );
    });

    function applyTheme(dark: boolean) {
        const theme = dark ? 'tanstack-dark' : 'tanstack-light';
        document.documentElement.setAttribute('data-theme', theme);
    }
</script>

<nav class="navbar max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
    <div class="navbar-start">
        <a href="/" class="text-xl font-bold tracking-tight">The Tinkerer</a>
    </div>
    <div class="navbar-end flex gap-6 items-center">
        <a
            href="/about/"
            class="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            >About</a
        >
        <a
            href="/blog/"
            class="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            >Blog</a
        >
        <a
            href="/contact/"
            class="text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            >Contact</a
        >

        <label
            class="swap swap-rotate ml-2 opacity-70 hover:opacity-100 transition-opacity"
        >
            <input
                type="checkbox"
                class="theme-controller"
                bind:checked={isDark}
            />

            <Sun class="swap-on size-6" />
            <Moon class="swap-off size-6" />
        </label>
    </div>
</nav>
