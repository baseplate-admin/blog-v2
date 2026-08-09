import htmx from 'htmx.org';

// -- HTMX 4.x config --
Object.assign((htmx as any).config, {
    history: true,
    defaultTimeout: 10000,
    noSwap: [204, 304, '4xx', '5xx'],
});

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
    requestAnimationFrame(() => {
        bar.style.width = '70%';
    });
};
const hideProgress = () => {
    const bar = document.querySelector('#nprogress-bar');
    if (!bar) return;
    bar.style.transition = 'width 0.3s ease, opacity 0.5s ease';
    bar.style.width = '100%';
    bar.style.opacity = '0';
    setTimeout(() => {
        bar.style.width = '0%';
        bar.style.opacity = '0';
    }, 300);
};

document.body.addEventListener('htmx:before:request', ((evt: Event) => {
    const elt = evt.target as HTMLElement | null;
    const isBoosted =
        elt?.hasAttribute('hx-boost') || elt?.closest('[hx-boost]');
    if (isBoosted) showProgress();
}) as EventListener);
document.body.addEventListener('htmx:after:request', ((evt: Event) => {
    const elt = evt.target as HTMLElement | null;
    const isBoosted =
        elt?.hasAttribute('hx-boost') || elt?.closest('[hx-boost]');
    if (isBoosted) hideProgress();
}) as EventListener);

// Expose globally
declare global {
  interface Window { htmx: typeof htmx }
}
window.htmx = htmx;
