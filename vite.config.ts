import { defineConfig } from 'vite';

import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [tailwindcss(), svelte()],
    base: '/static/',
    publicDir: resolve('./public'),
    build: {
        manifest: 'manifest.json',
        outDir: resolve('./static'),
        rollupOptions: {
            input: {
                vite: resolve('./assets/vite.ts'),
                tailwindcss: resolve('./assets/tailwind/tailwind.ts'),
                inter: resolve('./assets/fonts/inter/inter.ts'),
                twemoji: resolve('./assets/twemoji/index.ts'),

                // Svelte components
                navbar: resolve('./assets/components/Navbar.svelte'),
                toc: resolve('./assets/components/TableOfContents.svelte'),

                // Icons
                'x-icon': resolve('./assets/icons/X.svelte'),
                'right-arrow-icon': resolve('./assets/icons/RightArrow.svelte'),
                'calendar-icon': resolve('./assets/icons/Calendar.svelte'),
                'eye-icon': resolve('./assets/icons/Eye.svelte'),
            },
        },
    },
});
