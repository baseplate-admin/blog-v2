import './app.css';
import { createInertiaApp } from '@inertiajs/react';
import { initTheme } from './lib/hooks/theme';
import DefaultLayout from './layouts/DefaultLayout';

// Apply the stored theme before first paint to avoid a flash of the wrong theme.
initTheme();

// Eagerly import every page component. Webpack's `require.context` is the
// replacement for Vite's `import.meta.glob` — it generates a context module
// at build time that maps relative paths to their (eager) exports.
const pageContext = require.context('./pages', true, /\.tsx$/);
const pages: Record<string, { default: React.ComponentType<Record<string, unknown>> }> =
    {};
pageContext.keys().forEach((key) => {
    pages[key] = pageContext(key) as {
        default: React.ComponentType<Record<string, unknown>>;
    };
});

createInertiaApp({
    resolve: (name) => {
        const page = pages[`./${name}.tsx`];
        if (!page) {
            throw new Error(`Inertia page component not found: ${name}`);
        }
        return page.default;
    },
    // Inertia 3 `layout` is a callback: (component, page) => ComponentOrElement.
    // Return the DefaultLayout component; Inertia wraps each page with it.
    layout: () => DefaultLayout,
    // Progress bar for SPA navigation.
    progress: {
        color: '#8b5cf6',
    },
});
