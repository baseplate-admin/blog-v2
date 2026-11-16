import { useState } from 'react';
import Icon from '$lib/Icon';
import type { CodeBlock } from '$lib/types';

export default function Code({ block }: { block: CodeBlock }) {
    const value = block.value;
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(value.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            /* clipboard unavailable */
        }
    }

    return (
        <div className="my-8 overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
                <span className="font-mono text-xs uppercase tracking-wide text-foreground/50">{value.language_display}</span>
                <button
                    className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-foreground/60 transition-colors hover:bg-muted hover:text-foreground"
                    onClick={copy}
                    aria-label="Copy code">
                    <Icon name={copied ? 'check' : 'code'} className="size-3.5" />
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
            <div className="code-highlight overflow-x-auto">
                <div dangerouslySetInnerHTML={{ __html: value.highlighted }} />
            </div>
        </div>
    );
}
