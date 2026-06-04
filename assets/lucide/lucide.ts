import { createIcons, icons } from 'lucide';

function renderIcons() {
    createIcons({
        icons,
        attrs: {
            'stroke-width': 1.5,
            width: 20,
            height: 20,
        },
    });
}

// Initial render
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderIcons);
} else {
    requestAnimationFrame(renderIcons);
}

// Re-render after HTMX swaps so dynamic content gets icons
document.body.addEventListener('htmx:swapComplete', () => {
    requestAnimationFrame(renderIcons);
});
