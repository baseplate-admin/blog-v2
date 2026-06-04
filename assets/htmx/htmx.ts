import '../tailwind/tailwind.css';
import htmx from 'htmx.org';

// -- HTMX 4.x config --
Object.assign((htmx as any).config, {
    history: true,
    defaultTimeout: 10000,
    implicitInheritance: true,
    defaultSettleDelay: 10,
    noSwap: [204, 304, '4xx', '5xx'],
});

// Debug: observe HTMX swaps to find content disappearance cause
document.body.addEventListener('htmx:before:swap', ((evt: Event) => {
    const detail = (evt as CustomEvent).detail;
    if (detail && detail.boosted) {
        // Force innerHTML swap into main, no settle interference
        detail.swap = 'innerHTML';
    }
}) as EventListener);

// After swap: re-init AOS + Lucide for new content
document.body.addEventListener('htmx:after:swap', () => {
    // Remove htmx-requesting class to unhide content
    document.body.classList.remove('htmx-requesting');
});


// Inject HTMX transition styles via StyleSheet API (no <style> elements)
if (document.adoptedStylesheets) {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(`
      [hx-swap-oob] { opacity: 0; transition: opacity 0.2s ease-in-out; }
      .htmx-indicator { opacity: 0; transition: opacity 0.2s ease; }
      .htmx-requesting .htmx-indicator { opacity: 1 !important; }
    `).catch(() => {});
    document.adoptedStylesheets = [sheet];
}

// Loading state on body during HTMX requests
document.body.addEventListener('htmx:before:request', () => {
    document.body.classList.add('htmx-requesting');
});
document.body.addEventListener('htmx:after:request', () => {
    document.body.classList.remove('htmx-requesting');
});

// Progress bar for boosted navigation
const showProgress = () => {
    const bar = document.querySelector('#nprogress-bar');
    if (!bar) return;
    bar.style.width = '0%';
    bar.style.opacity = '1';
    bar.style.transition = 'width 0.4s ease';
    requestAnimationFrame(() => { bar.style.width = '70%'; });
};
const hideProgress = () => {
    const bar = document.querySelector('#nprogress-bar');
    if (!bar) return;
    bar.style.transition = 'width 0.3s ease, opacity 0.5s ease';
    bar.style.width = '100%';
    bar.style.opacity = '0';
    setTimeout(() => { bar.style.width = '0%'; bar.style.opacity = '0'; }, 300);
};

document.body.addEventListener('htmx:before:request', ((evt: Event) => {
    const elt = evt.target as HTMLElement | null;
    const isBoosted = elt?.hasAttribute('hx-boost') || elt?.closest('[hx-boost]');
    if (isBoosted) showProgress();
}) as EventListener);
document.body.addEventListener('htmx:after:request', ((evt: Event) => {
    const elt = evt.target as HTMLElement | null;
    const isBoosted = elt?.hasAttribute('hx-boost') || elt?.closest('[hx-boost]');
    if (isBoosted) hideProgress();
}) as EventListener);

// Progress bar CSS
const style = document.createElement('style');
style.textContent = `
    #nprogress-bar {
        position: fixed; top: 0; left: 0; width: 100%; height: 0.25rem; z-index: 9999;
        background: linear-gradient(to right, oklch(var(--p)), oklch(var(--s)));
        transform-origin: left;
        width: 0%; opacity: 0;
    }
`;
document.head.appendChild(style);

// Expose globally
(window as any).htmx = htmx;
