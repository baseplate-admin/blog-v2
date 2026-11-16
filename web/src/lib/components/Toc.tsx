import { useCallback, useEffect, useState } from 'react';
import { cn } from '$lib/utils';
import Icon from '$lib/Icon';
import type { TocItem } from '$lib/types';

/**
 * Takumi-docs style TOC rail: a vertical guide line with a sliding dot that
 * follows the active heading. H2 items sit on the straight rail (x=8.5);
 * H3 items curve out (x=16.5) and back. Scroll-spy: the last heading whose
 * top is <= 130px is active, with parent-H2 propagation.
 */
export default function Toc({ toc }: { toc: TocItem[] }) {
    const [activeId, setActiveId] = useState<string | null>(null);

    const updateActive = useCallback(() => {
        if (!toc.length) return;
        let current = toc[0].id;
        for (const item of toc) {
            const el = document.getElementById(item.id);
            if (el && el.getBoundingClientRect().top <= 130) {
                current = item.id;
            } else {
                break;
            }
        }
        setActiveId(current);
    }, [toc]);

    useEffect(() => {
        if (!toc.length) return;
        updateActive();
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                requestAnimationFrame(() => {
                    updateActive();
                    ticking = false;
                });
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [toc, updateActive]);

    function isActive(id: string): boolean {
        if (id === activeId) return true;
        // Parent H2 propagation: an active H3 also highlights its preceding H2.
        const idx = toc.findIndex((t) => t.id === id);
        const active = toc.find((t) => t.id === activeId);
        if (
            active &&
            idx !== -1 &&
            active.level === 'h3' &&
            toc[idx].level === 'h2'
        ) {
            const activeIdx = toc.findIndex((t) => t.id === activeId);
            for (let i = activeIdx; i >= 0; i--) {
                if (toc[i].level === 'h2') return toc[i].id === id;
            }
        }
        return false;
    }

    if (toc.length < 2) return null;

    return (
        <nav className="text-sm" aria-label="Table of contents">
            <div className="flex items-center gap-1.5 text-xs text-foreground/30 mb-3">
                <Icon name="list" size={14} />
                <span>On this page</span>
            </div>
            <div className="relative max-h-[calc(100vh-8rem)]">
                <div id="toc-list" className="relative flex flex-col">
                    {toc.map((item) => {
                        const active = isActive(item.id);
                        const x = item.level === 'h3' ? 16.5 : 8.5;
                        return (
                            <div
                                key={item.id}
                                className="relative flex flex-col"
                            >
                                <a
                                    href={'#' + item.id}
                                    data-active={String(active)}
                                    className={cn(
                                        'toc-link relative py-1.5 text-xs text-foreground/40 hover:text-primary transition-colors',
                                        item.level === 'h3' ? 'ps-8' : 'ps-5',
                                    )}
                                >
                                    {/* Rail line */}
                                    <svg
                                        className={cn(
                                            'absolute -top-1.5 inset-s-0 -z-10 h-[calc(100%+0.375rem)] bottom-1.5',
                                            item.level === 'h3' ? 'w-6' : 'w-4',
                                        )}
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                    >
                                        <line
                                            x1={x}
                                            y1="6"
                                            x2={x}
                                            y2="100%"
                                            strokeWidth="1"
                                            className="stroke-foreground/10"
                                        />
                                    </svg>
                                    {/* Sliding dot marker for the active item */}
                                    <span
                                        className={cn(
                                            'absolute top-1/2 -translate-y-1/2 size-2 rounded-full bg-primary transition-all duration-200',
                                            'inset-s-0',
                                            item.level === 'h3'
                                                ? 'left-[16.5px]'
                                                : 'left-[8.5px]',
                                            '-translate-x-1/2',
                                        )}
                                        style={{ opacity: active ? 1 : 0 }}
                                    />
                                    {item.text}
                                </a>
                            </div>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
