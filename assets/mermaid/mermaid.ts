import mermaid from 'mermaid';

// Read computed CSS from DaisyUI theme to get actual color values
function getCssVar(name: string): string {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '';
}

// Initialize mermaid with colors resolved from DaisyUI CSS variables
function initMermaid() {
    const primary = getCssVar('--p') || '#8b5cf6';
    const baseContent = getCssVar('--bc') || '#e4e4e7';
    const base300 = getCssVar('--b3') || '#3f3f46';
    const neutral = getCssVar('--n') || '#27272a';

    mermaid.initialize({
        startOnLoad: false,
        theme: 'dark',
        securityLevel: 'loose',
        fontFamily: 'var(--font-family-body, "Plus Jakarta Sans", "Inter", sans-serif)',
        fontSize: 16,
        darkMode: true,
        themeVariables: {
            primaryColor: primary,
            primaryTextColor: baseContent,
            primaryBorderColor: base300,
            lineColor: base300,
            secondaryColor: neutral,
            tertiaryColor: base300,
            fontSize: '16px',
        },
    });
}

initMermaid();

// Global render function called by HTMX intersect handler
window.__mermaidRender = async function (container: HTMLElement) {
    const code = container.getAttribute('data-mermaid-code');
    const theme = container.getAttribute('data-mermaid-theme');
    if (!code) return;

    // Re-initialize with the specified theme
    if (theme) {
        mermaid.initialize({
            startOnLoad: false,
            theme,
            securityLevel: 'loose',
            darkMode: theme === 'dark',
        });
    }

    try {
        const id = `mermaid-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const decodedCode = decodeURIComponent(code);
        const { svg } = await mermaid.render(id, decodedCode);
        container.innerHTML = svg;
        container.classList.add('mermaid-rendered');
    } catch (err) {
        console.error('Mermaid render error:', err);
        const decodedCode = decodeURIComponent(code);
        container.innerHTML = `
            <div class="text-error text-sm font-mono py-4">
                <p class="font-semibold mb-1">Diagram render failed</p>
                <pre class="text-xs opacity-70 bg-base-300/30 rounded p-3 overflow-auto">${escape(decodedCode)}</pre>
            </div>`;
    }
};

// Helper to escape HTML for error display
function escape(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
}
