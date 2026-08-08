// Copy button handler for code blocks

function initCopyButtons() {
    const buttons = document.querySelectorAll('.code-copy-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const wrapper = btn.closest('.code-block-wrapper');
            if (!wrapper) return;
            const pre = wrapper.querySelector('.code-highlight pre');
            if (!pre) return;
            const clone = pre.cloneNode(true) as HTMLElement;
            clone.querySelectorAll('.linenos').forEach(s => s.remove());
            const code = clone.textContent || '';
            navigator.clipboard.writeText(code).then(() => {
                const textSpan = btn.querySelector('.code-copy-text');
                if (textSpan) {
                    textSpan.textContent = 'Copied!';
                    setTimeout(() => {
                        textSpan.textContent = 'Copy';
                    }, 2000);
                }
            });
        });
    });
}

// Initial render — use DOMContentLoaded if document not yet complete
if (document.readyState !== 'complete') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
} else {
    requestAnimationFrame(initCopyButtons);
}

// Re-init after HTMX swaps
if ((window as any).htmx) {
    document.body.addEventListener('htmx:after:swap', () => {
        requestAnimationFrame(initCopyButtons);
    });
}
