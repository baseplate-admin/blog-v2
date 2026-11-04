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
        sourcemap: true,
        rollupOptions: {
            input: {
                // CSS
                tailwind: resolve('./assets/tailwind/index.ts'),
                // JavaScript
                themeInit: resolve('./assets/theme/theme-init.ts'),
                htmx: resolve('./assets/htmx/htmx.ts'),
                aos: resolve('./assets/aos/aos.ts'),
                toc: resolve('./assets/toc/toc.ts'),
                copy: resolve('./assets/copy/index.ts'),
                mermaid: resolve('./assets/mermaid/mermaid.ts'),
            },
        },
    },
});
