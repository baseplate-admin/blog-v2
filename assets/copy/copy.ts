// Copy button handler for code blocks

function showFeedback(btn: Element, state: 'copying' | 'copied' | 'error') {
    const textSpan = btn.querySelector('.code-copy-text');
    if (!textSpan) return;
    if (state === 'copied') {
        textSpan.textContent = 'Copied!';
        setTimeout(() => { textSpan.textContent = 'Copy'; }, 2000);
    } else if (state === 'error') {
        textSpan.textContent = 'Failed';
        setTimeout(() => { textSpan.textContent = 'Copy'; }, 2000);
    }
}

function copyToClipboard(text: string): Promise<void> {
    if (navigator.clipboard && window.isSecureContext) {
        return navigator.clipboard.writeText(text);
    }
    // Fallback for non-secure contexts or older browsers
    return new Promise((resolve, reject) => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            resolve();
        } catch (e) {
            reject(e);
        }
        textarea.remove();
    });
}

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
            copyToClipboard(code)
                .then(() => showFeedback(btn, 'copied'))
                .catch(() => showFeedback(btn, 'error'));
        });
    });
}

// Initial render — use DOMContentLoaded if document not yet complete
if (document.readyState !== 'complete') {
    document.addEventListener('DOMContentLoaded', initCopyButtons);
} else {
    initCopyButtons();
}

// Re-init after HTMX swaps
if ((window as any).htmx) {
    document.body.addEventListener('htmx:after:swap', () => {
        requestAnimationFrame(initCopyButtons);
    });
}
