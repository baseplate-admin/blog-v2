import 'vite/modulepreload-polyfill';
import './app.css';
import { createInertiaApp } from '@inertiajs/svelte';
import { initTheme } from './lib/hooks/theme';

import DefaultLayout from './layouts/DefaultLayout.svelte';

// Apply the stored theme before first paint to avoid a flash of the wrong theme.
initTheme();

createInertiaApp({
    resolve: (name) => {
        const pages = import.meta.glob('./pages/**/*.svelte', {
            eager: true,
        }) as Record<string, { default: typeof DefaultLayout }>;
        const page = pages[`./pages/${name}.svelte`];
        return {
            default: page.default as unknown as import('svelte').Component,
            layout: DefaultLayout as unknown as import('svelte').Component,
        };
    },
    // Progress bar for SPA navigation.
    progress: {
        color: '#8b5cf6',
    },
});
