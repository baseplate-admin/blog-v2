import { defineConfig } from 'vite';
import { resolve } from 'path';
import tailwindcss from '@tailwindcss/vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
    plugins: [svelte(), tailwindcss()],
    base: '/static/',
    server: {
        host: '127.0.0.1',
        port: 5173,
        // Make dev asset URLs (fonts, etc.) absolute to the Vite server instead
        // of resolving against the Django origin.
        origin: 'http://127.0.0.1:5173',
    },
    // Vendored assets (Twemoji, icons) are imported via import.meta.glob;
    // disabling publicDir avoids copying the 3,689 SVGs a second time.
    publicDir: false,
    optimizeDeps: {
        // Vite 8's Rolldown dep scanner follows bits-ui's type-only
        // `import type ... from "svelte/elements"` and fails to resolve it.
        // Skip the optional cold-start scan; this stack is ESM-only.
        noDiscovery: true,
    },
    resolve: {
        alias: {
            $lib: resolve('./web/src/lib'),
        },
    },
    build: {
        manifest: 'manifest.json',
        outDir: resolve('./static'),
        sourcemap: true,
        rollupOptions: {
            input: {
                main: resolve('./web/src/main.ts'),
            },
        },
    },
});
