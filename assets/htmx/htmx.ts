import htmx from 'htmx.org';

// -- HTMX config --
Object.assign((htmx as any).config, {
    historyEnabled: true,
    allowNestedHxHistory: false,
    timeout: 10000,
    disableExternalRefInheritance: true,
    swapStyleOverwrite: 'transition:opacity 200ms ease-in-out,opacity 200ms ease-in-out',
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
document.body.addEventListener('htmx:request', () => {
    document.body.classList.add('htmx-requesting');
});
document.body.addEventListener('htmx:responseOnReady', () => {
    document.body.classList.remove('htmx-requesting');
});

// Popstate buffering: browser fires popstate before scripts initialize.
// Without buffering, back/forward triggers a full page load instead of HTMX swap.
const bufferedUrl: { href: string } = { href: window.location.href };
let hasBuffer: boolean = false;

const bufferPopState = (e: PopStateEvent) => {
    if ((e.state as any)?.htmx !== undefined) return;
    e.preventDefault();
    hasBuffer = true;
    bufferedUrl.href = new URL(e.state?.url ?? window.location.href, document.baseURI).href;
};
window.addEventListener('popstate', bufferPopState, { capture: true });

// Flush buffer once HTMX starts processing requests
const flushBuffer = () => {
    window.removeEventListener('popstate', bufferPopState, true);
    if (hasBuffer) {
        hasBuffer = false;
        htmx.ajax('GET', bufferedUrl.href, { target: 'body', select: 'body' });
    }
};
document.body.addEventListener('htmx:beforeRequest', flushBuffer, { once: true });

// Expose globally
(window as any).htmx = htmx;
