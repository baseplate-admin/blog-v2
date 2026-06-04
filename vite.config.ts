import { defineConfig } from 'vite';

import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [tailwindcss()],
    base: '/static/',
    publicDir: resolve('./public'),
    build: {
        manifest: 'manifest.json',
        outDir: resolve('./static'),
        rollupOptions: {
            input: {
                tailwindcss: resolve('./assets/tailwind/tailwind.ts'),
                inter: resolve('./assets/fonts/inter/inter.ts'),
                htmx: resolve('./assets/htmx/htmx.ts'),
                aos: resolve('./assets/aos/aos.ts'),
            },
        },
    },
});
