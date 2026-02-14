import { defineConfig } from 'vite';

import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import twemoji from 'twemoji';

export default defineConfig({
    plugins: [tailwindcss()],
    base: '/static/',
    build: {
        manifest: 'manifest.json',
        outDir: resolve('./static'),
        rollupOptions: {
            input: {
                vite: resolve('./assets/vite.ts'),
                tailwindcss: resolve('./assets/tailwind.css'),
                inter: resolve('./assets/fonts/inter.scss'),
                twemoji: resolve('./assets/twemoji/index.ts'),
            },
        },
    },
});
