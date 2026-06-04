import '../tailwind/tailwind.css';
import htmx from 'htmx.org';

// -- HTMX 4.x config --
Object.assign((htmx as any).config, {
    history: true,
    defaultTimeout: 10000,
    noSwap: [204, 304, '4xx', '5xx'],
});

// After swap: re-init AOS for new elements
document.body.addEventListener('htmx:after:swap', ((evt: Event) => {
    const detail = (evt as CustomEvent).detail;
    if (!detail?.boosted) return;
    requestAnimationFrame(() => {
        const aos = (window as any).AOS;
        if (aos) {
            aos.refresh();
            document.querySelectorAll('[data-aos]').forEach((el: Element) => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.classList.add('aos-animate');
                }
            });
        }
    });
}) as EventListener);

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
