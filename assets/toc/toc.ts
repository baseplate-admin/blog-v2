interface TocHeading {
    id: string;
    element: HTMLElement;
    link: HTMLAnchorElement;
    level: string;
}

let slugObserver: IntersectionObserver | null = null;

/* ── SVG rail path builder ─────────────────────────────────────── */
function buildRailPath(
    levels: string[],
    itemMids: number[],
    totalHeight: number,
): string {
    let d = `M 8.5 0 L 8.5 ${itemMids[0]}`;

    for (let i = 0; i < levels.length; i++) {
        const mid = itemMids[i];
        const isH3 = levels[i] === 'h3';

        if (isH3) {
            d += ` C 8.5 ${(mid - 4).toFixed(1)} 16.5 ${(mid - 1).toFixed(1)} 16.5 ${(mid + 2).toFixed(1)}`;
            d += ` L 16.5 ${(mid + 6).toFixed(1)}`;
        } else {
            d += ` C 8.5 ${(mid - 4).toFixed(1)} 8.5 ${(mid + 4).toFixed(1)} 8.5 ${(mid + 8).toFixed(1)}`;
        }
    }

    d += ` L 8.5 ${totalHeight}`;
    return d;
}

/* ── Slug (colored track + dot) animation ──────────────────────── */
function createSlugAnimation(
    nav: HTMLElement,
    tocItems: HTMLElement[],
    headings: TocHeading[],
): void {
    const list = nav.querySelector('#toc-list');
    if (!list) return;

    const levels = headings.map((h) => h.level);
    const pathWidth = levels.some((l) => l === 'h3') ? 24.5 : 16.5;

    function getItemPositions(): {
        top: number;
        mid: number;
        bottom: number;
    }[] {
        const positions: { top: number; mid: number; bottom: number }[] = [];
        let cumulativeTop = 0;
        for (const item of tocItems) {
            const h = item.scrollHeight;
            positions.push({
                top: cumulativeTop,
                mid: cumulativeTop + h / 2,
                bottom: cumulativeTop + h,
            });
            cumulativeTop += h;
        }
        return positions;
    }

    const positions = getItemPositions();
    const totalHeight = positions[positions.length - 1].bottom;
    const itemMids = positions.map((p) => p.mid);
    const pathD = buildRailPath(levels, itemMids, totalHeight);

    const slugContainer = document.createElement('div');
    slugContainer.setAttribute(
        'class',
        'absolute inset-s-0 origin-center',
    );
    slugContainer.style.width = `${pathWidth}px`;
    slugContainer.style.height = `${totalHeight}px`;
    slugContainer.style.top = '0';
    slugContainer.style.setProperty('--track-top', '0px');
    slugContainer.style.setProperty('--track-bottom', '0px');
    slugContainer.style.setProperty('--offset-distance', '0px');
    slugContainer.style.setProperty('--opacity', '0');


    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${pathWidth} ${totalHeight}`);
    svg.setAttribute('width', String(pathWidth));
    svg.setAttribute('height', String(totalHeight));
    svg.setAttribute('class', 'absolute transition-[clip-path]');
    svg.style.clipPath =
        'polygon(0 var(--track-top,0), 100% var(--track-top,0), 100% var(--track-bottom,0), 0 var(--track-bottom,0))';

    const pathEl = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'path',
    );
    pathEl.setAttribute('d', pathD);
    pathEl.setAttribute('stroke-width', '1');
    pathEl.setAttribute('fill', 'none');
    pathEl.setAttribute('class', 'stroke-primary');
    svg.appendChild(pathEl);
    slugContainer.appendChild(svg);

    const dot = document.createElement('div');
    dot.setAttribute('class', 'absolute left-0 rounded-full');
    dot.style.width = '4px';
    dot.style.height = '4px';
    dot.style.backgroundColor = 'var(--color-primary)';
    dot.style.offsetPath = `path("${pathD}")`;
    dot.style.offsetDistance = 'var(--offset-distance, 0px)';
    dot.style.opacity = 'var(--opacity, 0)';
    dot.style.transition = 'opacity 0.25s ease, offset-distance 0.25s ease';
    slugContainer.appendChild(dot);

    list.appendChild(slugContainer);

    let activeIndex = 0;

    function updateSlug(
        firstVisibleIndex: number,
        lastVisibleIndex: number,
        centerIndex: number,
    ): void {
        const trackTop = positions[firstVisibleIndex].top;
        const trackBottom = positions[lastVisibleIndex].bottom;

        // Dot follows scroll position within the slider range.
        // At page top → dot at start, at page bottom → dot at end.
        const atTop = window.scrollY <= 5;
        const atBottom = window.scrollY >= document.documentElement.scrollHeight - window.innerHeight - 5;
        let dotPos: number;
        if (atTop) {
            dotPos = trackTop;
        } else if (atBottom) {
            dotPos = trackBottom;
        } else {
            const clampedIndex = Math.max(firstVisibleIndex, Math.min(lastVisibleIndex, centerIndex));
            const range = lastVisibleIndex - firstVisibleIndex;
            const progress = range > 0 ? (clampedIndex - firstVisibleIndex) / range : 0;
            dotPos = trackTop + Math.max(0, Math.min(1, progress)) * (trackBottom - trackTop);
        }

        slugContainer.style.setProperty('--track-top', `${trackTop}px`);
        slugContainer.style.setProperty('--track-bottom', `${trackBottom}px`);
        slugContainer.style.setProperty('--offset-distance', `${dotPos}px`);
        slugContainer.style.setProperty('--opacity', '1');
    }

    nav.addEventListener('toc:active-change', (e: Event) => {
        const detail = (e as CustomEvent).detail as {
            index: number;
            centerIndex?: number;
            visibleRange?: { first: number; last: number };
        };
        activeIndex = detail.index;
        if (detail.visibleRange) {
            if (detail.centerIndex !== undefined) {
                updateSlug(detail.visibleRange.first, detail.visibleRange.last, detail.centerIndex);
            } else {
                updateSlug(detail.visibleRange.first, detail.visibleRange.last, activeIndex);
            }
        } else {
            updateSlug(activeIndex, activeIndex, activeIndex);
        }
    });

    // Initial setup
    const hashId = location.hash.slice(1);
    const initialIndex = hashId
        ? headings.findIndex((h) => h.id === hashId)
        : 0;
    activeIndex = initialIndex >= 0 ? initialIndex : 0;

    nav.dispatchEvent(
        new CustomEvent('toc:active-change', {
            detail: {
                index: activeIndex,
                visibleRange: { first: 0, last: headings.length - 1 },
            },
        }),
    );
}

/* ── Curved SVG paths for H3 items that follow H2 ──────────────── */
function injectH3Curves(nav: HTMLElement): void {
    const links = Array.from(nav.querySelectorAll('.toc-link')) as HTMLAnchorElement[];
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const level = link.getAttribute('data-level') ?? 'h2';
        if (level !== 'h3') continue;

        const prevLevel = (links[i - 1]?.getAttribute('data-level') ?? 'h2');
        if (prevLevel !== 'h2') continue;

        const svg = link.querySelector<SVGSVGElement>('svg[data-rail-svg]');
        if (!svg) continue;

        svg.innerHTML = '';
        const ns = 'http://www.w3.org/2000/svg';

        const curve = document.createElementNS(ns, 'path');
        curve.setAttribute('d', 'M 8.5 0 C 8.5 8 16.5 4 16.5 12');
        curve.setAttribute('stroke-width', '1');
        curve.setAttribute('fill', 'none');
        curve.setAttribute('class', 'stroke-base-content/10');
        svg.appendChild(curve);

        const line = document.createElementNS(ns, 'line');
        line.setAttribute('x1', '16.5');
        line.setAttribute('y1', '12');
        line.setAttribute('x2', '16.5');
        line.setAttribute('y2', '100%');
        line.setAttribute('stroke-width', '1');
        line.setAttribute('class', 'stroke-base-content/10');
        svg.appendChild(line);
    }
}

/* ── Main init ─────────────────────────────────────────────────── */
function initToc(): void {
    const content = document.getElementById('article-content');
    const nav = document.getElementById('toc-nav');
    if (!content || !nav) return;

    // Stretch the aside to match article height so sticky has room to work.
    // align-self: start (set in HTML) ensures sticky content starts at top of aside.
    const article = document.getElementById('article-content')?.closest('article');
    const wrapper = document.getElementById('toc-wrapper');
    if (article && wrapper) {
        wrapper.style.height = article.offsetHeight + 'px';
    }

    // Clean up previous slug animation and observer
    const listEl = nav.querySelector('#toc-list');
    if (listEl) {
        const existingSlug = listEl.querySelector('div.absolute.top-0.inset-s-0');
        if (existingSlug) existingSlug.remove();
    }
    if (slugObserver) {
        slugObserver.disconnect();
        slugObserver = null;
    }

    const headers = Array.from(
        content.querySelectorAll('h2, h3'),
    ) as HTMLElement[];
    if (!headers.length) {
        const wrapper = document.getElementById('toc-wrapper');
        if (wrapper) wrapper.style.display = 'none';
        return;
    }

    const tocLinks = Array.from(
        nav.querySelectorAll('.toc-link'),
    ) as HTMLAnchorElement[];

    const tocItems = Array.from(
        nav.querySelectorAll('[data-toc-item]'),
    ) as HTMLElement[];

    injectH3Curves(nav);

    // Match TOC links to content headings by text content
    const headingMap = new Map<string, HTMLElement>();
    const usedHeadings = new Set<number>();

    tocLinks.forEach((link) => {
        const targetId = link.getAttribute('data-target') ?? '';
        const linkText = link.textContent.trim();
        let matchedIndex = -1;
        for (let i = 0; i < headers.length; i++) {
            if (usedHeadings.has(i)) continue;
            if (headers[i].textContent.trim() === linkText) {
                matchedIndex = i;
                break;
            }
        }
        if (matchedIndex >= 0) {
            const h = headers[matchedIndex];
            if (!h.id) h.id = targetId;
            headingMap.set(targetId, h);
            usedHeadings.add(matchedIndex);
        }
    });

    tocLinks.forEach((link) => {
        const targetId = link.getAttribute('data-target');
        const target = headingMap.get(targetId ?? '');
        if (target) {
            link.setAttribute('href', `#${target.id}`);
        }
    });

    // Smooth scroll on click
    tocLinks.forEach((link) => {
        link.addEventListener('click', (e: Event) => {
            const href = link.getAttribute('href');
            if (!href) return;
            const id = href.slice(1);
            const target = headingMap.get(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                history.replaceState(null, '', `#${id}`);
            }
        });
    });

    const headings: TocHeading[] = tocLinks
        .map((link) => {
            const targetId = link.getAttribute('data-target') ?? '';
            const element = headingMap.get(targetId);
            if (!element) return null;
            return {
                id: targetId,
                element,
                link,
                level: link.getAttribute('data-level') ?? 'h2',
            };
        })
        .filter((h): h is TocHeading => h !== null);

    createSlugAnimation(nav, tocItems, headings);

    /* ── Takumi-style scroll-spy ──────────────────────────────
     * Algorithm: find the last heading whose top position is
     * <= the threshold (100px from viewport top). That heading
     * is the one the reader is currently on.
     *
     * Parent H2 propagation: when an H3 is active, also mark
     * the preceding H2 as active (same as Takumi docs).
     * ───────────────────────────────────────────────────────── */
    const SCROLL_SPY_THRESHOLD = 100;

    function setActiveHeading(activeIdx: number): void {
        // Determine the range to highlight: if H3 is active,
        // include the preceding H2 (parent propagation).
        let highlightStart = activeIdx;
        if (headings[activeIdx].level === 'h3') {
            // Find the preceding H2
            for (let i = activeIdx; i >= 0; i--) {
                if (headings[i].level === 'h2') {
                    highlightStart = i;
                    break;
                }
            }
        }

        // Find visible range for slug animation + highlight all covered headings
        const viewportTop = -SCROLL_SPY_THRESHOLD;
        const viewportBottom = window.innerHeight;
        const visibleHeadings: number[] = [];
        for (let i = 0; i < headings.length; i++) {
            const rect = headings[i].element.getBoundingClientRect();
            if (rect.top >= viewportTop && rect.top <= viewportBottom) {
                visibleHeadings.push(i);
            }
        }

        const firstVisible = visibleHeadings.length ? visibleHeadings[0] : 0;
        const lastVisible = visibleHeadings.length ? visibleHeadings[visibleHeadings.length - 1] : headings.length - 1;

        // Find the heading closest to the center of the viewport for smooth dot tracking.
        const viewportCenter = window.innerHeight / 2;
        let centerIndex = firstVisible;
        let centerDist = Infinity;
        for (const i of visibleHeadings) {
            const rect = headings[i].element.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            const dist = Math.abs(center - viewportCenter);
            if (dist < centerDist) {
                centerDist = dist;
                centerIndex = i;
            }
        }

        // Highlight all headings covered by the slider (from parent H2 up to last visible)
        let highlightEnd = lastVisible;

        // Update data-active on all links
        headings.forEach((h, i) => {
            const isActive = i >= highlightStart && i <= highlightEnd;
            h.link.setAttribute('data-active', String(isActive));
        });

        nav.dispatchEvent(
            new CustomEvent('toc:active-change', {
                detail: {
                    index: activeIdx,
                    centerIndex: centerIndex,
                    visibleRange: { first: firstVisible, last: lastVisible },
                },
            }),
        );
    }

    function updateScrollSpy(): void {
        let activeIdx = 0;

        for (let i = 0; i < headings.length; i++) {
            const rect = headings[i].element.getBoundingClientRect();
            if (rect.top <= SCROLL_SPY_THRESHOLD) {
                activeIdx = i;
            } else {
                break;
            }
        }

        setActiveHeading(activeIdx);
    }

    let rafId: number | null = null;

    slugObserver = new IntersectionObserver(
        () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateScrollSpy);
        },
        { rootMargin: '-10% 0px -50% 0px', threshold: [0] },
    );

    headings.forEach((h) => {
        if (h.element && h.element.isConnected) {
            slugObserver!.observe(h.element);
        }
    });

    // Initial call — set first heading active
    updateScrollSpy();

    // If there's a hash, scroll to it and set that heading active
    const hashId = location.hash.slice(1);
    const hashIndex = headings.findIndex((h) => h.id === hashId);
    if (hashIndex >= 0) {
        setActiveHeading(hashIndex);
    }
}

// Initial render
if (document.readyState !== 'complete') {
    document.addEventListener('DOMContentLoaded', initToc);
} else {
    initToc();
}

// Re-init after HTMX swaps
if ((window as any).htmx) {
    document.body.addEventListener('htmx:after:swap', () => {
        setTimeout(initToc, 100);
    });
}
