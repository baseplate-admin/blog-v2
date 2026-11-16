import './app.css';
import { createInertiaApp } from '@inertiajs/react';
import { initTheme } from './lib/hooks/theme';
import DefaultLayout from './layouts/DefaultLayout';

// Apply the stored theme before first paint to avoid a flash of the wrong theme.
initTheme();

// Eagerly import every page component. `require.context` is webpack's native
// context API (the equivalent of Vite's `import.meta.glob`) — it generates a
// context module at build time that maps relative paths to their exports.
// `mode: 'eager'` inlines every page into the initial bundle so `resolve` is
// synchronous and Inertia's first render never awaits a chunk.
const pageContext = require.context('./pages', true, /\.tsx$/, 'eager');

createInertiaApp({
    resolve: async (name) => {
        const key = `./${name}.tsx`;
        if (!pageContext.keys().includes(key)) {
            throw new Error(`Inertia page component not found: ${name}`);
        }
        const mod = (await pageContext(key)) as {
            default: React.ComponentType<Record<string, unknown>>;
        };
        return mod.default;
    },
    // Inertia 3 `layout` is a callback: (component, page) => ComponentOrElement.
    // Return the DefaultLayout component; Inertia wraps each page with it.
    layout: () => DefaultLayout,
    // Progress bar for SPA navigation.
    progress: {
        color: '#8b5cf6',
    },
});
