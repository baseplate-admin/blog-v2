import { useEffect, useRef, useState } from 'react';
import type { MermaidBlock } from '$lib/types';
import type * as MermaidModule from 'mermaid';

export default function Mermaid({ block }: { block: MermaidBlock }) {
    const value = block.value;
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [rendered, setRendered] = useState(false);

    // Mermaid is large (~2MB with cytoscape/katex). Import it only when a
    // diagram actually scrolls into view, so it never blocks first paint.
    let mermaidPromise: Promise<typeof MermaidModule> | null = null;
    function loadMermaid(): Promise<typeof MermaidModule> {
        mermaidPromise ??= import('mermaid');
        return mermaidPromise;
    }

    const doRender = async () => {
        if (rendered) return;
        setRendered(true);
        try {
            const mermaid = (await loadMermaid()).default;
            mermaid.initialize({
                startOnLoad: false,
                securityLevel: 'loose',
                theme: value.theme as import('mermaid').MermaidConfig['theme'],
            });
            const { svg: out } = await mermaid.render(`mermaid-${Math.random().toString(36).slice(2)}`, value.code);
            setSvg(out);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        }
    };

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((e) => e.isIntersecting)) {
                    void doRender();
                    observer.disconnect();
                }
            },
            { rootMargin: '100px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div ref={containerRef} className="my-8 flex justify-center overflow-x-auto rounded-xl border border-border bg-card p-4" data-mermaid>
            {!rendered && !error ? (
                <div className="flex items-center gap-2 text-sm text-foreground/60">
                    <span className="size-2 animate-pulse rounded-full bg-primary" />
                    Rendering diagram...
                </div>
            ) : (
                <div className="w-full max-w-full [&>svg]:max-w-full [&>svg]:h-auto" aria-label="Mermaid diagram">
                    <div dangerouslySetInnerHTML={{ __html: svg }} />
                </div>
            )}
            {error && <pre className="mt-2 whitespace-pre-wrap break-words text-xs text-error">{error}</pre>}
        </div>
    );
}
