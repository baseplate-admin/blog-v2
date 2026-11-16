import { useState } from 'react';
import Icon from '$lib/Icon';
import type { TocItem } from '$lib/types';

/**
 * Mobile table of contents (ported from TanStack's TocMobile).
 * A native <details> disclosure under the article header; hidden on lg+,
 * where the sticky sidebar TOC takes over.
 */
export default function TocMobile({ toc }: { toc: TocItem[] }) {
    const [open, setOpen] = useState(false);

    if (toc.length === 0) return null;

    return (
        <details
            className="mt-8 rounded-xl border border-border bg-card/40 lg:hidden"
            open={open}
            onToggle={(event) => setOpen(event.currentTarget.open)}
        >
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-medium text-foreground/70 [&::-webkit-details-marker]:hidden">
                <Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />
                On this page
            </summary>
            <ul className="border-t border-border/50 px-4 py-3">
                {toc.map((item) => (
                    <li key={item.id}>
                        <a
                            href={'#' + item.id}
                            onClick={() => setOpen(false)}
                            className="block py-1 text-sm text-foreground/60 transition-colors hover:text-primary"
                            style={{
                                paddingInlineStart: item.level === 'h3' ? 16 : 0,
                            }}
                        >
                            {item.text}
                        </a>
                    </li>
                ))}
            </ul>
        </details>
    );
}
