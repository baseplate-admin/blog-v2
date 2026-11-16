import { useEffect, useRef, useState } from 'react';
import { cn } from '$lib/utils';
import Icon from '$lib/Icon';
import type { TocItem } from '$lib/types';

/**
 * Desktop table of contents.
 *
 * Active detection follows Fumadocs/TanStack: the active item is the last
 * heading whose top has passed a reading line near the top of the viewport,
 * with the first heading active before any heading reaches it and the last
 * heading active at the bottom of the page. A single active item avoids the
 * flicker you get from intersecting multiple headings at once.
 *
 * A single indicator bar slides between items (`transition-[top,height]`),
 * and the surrounding scroll area follows the active item smoothly.
 */
export default function Toc({ toc }: { toc: TocItem[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);
    const [indicator, setIndicator] = useState({ top: 0, height: 0 });
    const scrollerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Reading line, measured from the top of the viewport.
    useEffect(() => {
        if (!toc.length) return;

        let frame = 0;

        const compute = () => {
            const line = 140;
            let current = toc[0]?.id ?? null;

            for (const item of toc) {
                const el = document.getElementById(item.id);
                if (!el) continue;
                if (el.getBoundingClientRect().top - line <= 0) {
                    current = item.id;
                } else {
                    break;
                }
            }

            const doc = document.documentElement;
            if (window.innerHeight + window.scrollY >= doc.scrollHeight - 8) {
                current = toc[toc.length - 1].id;
            }

            setActiveId((prev) => (prev === current ? prev : current));
        };

        const onScroll = () => {
            if (frame) return;
            frame = requestAnimationFrame(() => {
                frame = 0;
                compute();
            });
        };

        compute();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [toc]);

    // Slide the indicator to the active item.
    useEffect(() => {
        const list = listRef.current;
        if (!list || !activeId) return;
        const anchor = list.querySelector<HTMLElement>(
            `a[href="#${CSS.escape(activeId)}"]`,
        );
        if (!anchor) return;
        setIndicator({ top: anchor.offsetTop, height: anchor.offsetHeight });
    }, [activeId, toc]);

    // Keep the active item inside the TOC scroll area.
    useEffect(() => {
        const scroller = scrollerRef.current;
        const list = listRef.current;
        if (!scroller || !list || !activeId) return;

        const anchor = list.querySelector<HTMLElement>(
            `a[href="#${CSS.escape(activeId)}"]`,
        );
        if (!anchor) return;

        const top = list.offsetTop + anchor.offsetTop;
        const bottom = top + anchor.offsetHeight;
        const viewTop = scroller.scrollTop;
        const viewBottom = viewTop + scroller.clientHeight;

        if (top < viewTop + 8) {
            scroller.scrollTo({ top: Math.max(0, top - 8), behavior: 'smooth' });
        } else if (bottom > viewBottom - 8) {
            scroller.scrollTo({
                top: bottom - scroller.clientHeight + 8,
                behavior: 'smooth',
            });
        }
    }, [activeId]);

    if (toc.length === 0) return null;

    return (
        <nav className="text-sm" aria-label="Table of contents">
            <h3 className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/50">
                <Icon name="list" size={16} />
                On this page
            </h3>

            <div
                ref={scrollerRef}
                className="relative mt-3 max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain py-1 [mask-image:linear-gradient(to_bottom,transparent,white_16px,white_calc(100%-16px),transparent)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                <span
                    aria-hidden="true"
                    className="absolute inset-s-0 w-0.5 rounded-full bg-primary transition-[top,height] duration-300 ease-out"
                    style={{ top: indicator.top, height: indicator.height }}
                />
                <ul ref={listRef} className="flex flex-col">
                    {toc.map((item) => {
                        const active = item.id === activeId;
                        return (
                            <li key={item.id}>
                                <a
                                    href={'#' + item.id}
                                    data-active={String(active)}
                                    aria-current={active ? 'location' : undefined}
                                    className={cn(
                                        'block py-1.5 text-[0.8125rem]/5 break-words transition-colors duration-200',
                                        active
                                            ? 'text-primary'
                                            : 'text-foreground/50 hover:bg-muted/50 hover:text-foreground',
                                    )}
                                    style={{
                                        paddingInlineStart: item.level === 'h3' ? 20 : 8,
                                    }}
                                >
                                    {item.text}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </nav>
    );
}
