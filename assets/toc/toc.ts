interface TocHeading {
    id: string;
    element: HTMLElement;
    link: HTMLAnchorElement;
    level: string;
}

let slugObserver: IntersectionObserver | null = null;

/* ── SVG rail path builder — sharp curves matching Takumi docs ────
 * H2 items: straight vertical line at x=8.5
 * H3 items: quadratic curve from x=8.5 to x=16.5 at the H2→H3 boundary,
 *           straight vertical at x=16.5 for all consecutive H3s,
 *           quadratic curve back to x=8.5 at the H3→H2 boundary
 * ──────────────────────────────────────────────────────────────── */
function buildRailPath(
    levels: string[],
    itemMids: number[],
    totalHeight: number,
): string {
    // Build a single continuous path.
    // H2 items at x=8.5, H3 items at x=16.5.
    // Track current X so the path never jumps.
    // Column switches happen BETWEEN items, not on the item itself.
    let d = `M 8.5 0`;
    let curX = 8.5;
    let prevBottom = 0;

    for (let i = 0; i < levels.length; i++) {
        const mid = itemMids[i];
        const isH3 = levels[i] === 'h3';
        const targetX = isH3 ? 16.5 : 8.5;
        const itemBottom = mid + 6;

        // If switching columns, curve between previous item and current item
        if (curX !== targetX) {
            const curveY = (prevBottom + mid) / 2;
            d += ` L ${curX} ${curveY}`;
            d += ` Q ${curX} ${(curveY - 2).toFixed(1)} ${targetX} ${(curveY + 2).toFixed(1)}`;
            curX = targetX;
        }

        // Move vertically to the item's bottom
        d += ` L ${curX} ${itemBottom}`;
        prevBottom = itemBottom;
    }

    d += ` L 8.5 ${totalHeight}`;
    return d;
}

/* ── Slug (colored track + dot) animation ────────────────────────
 * Clip-path polygon for the track (sharp rectangular corners).
 * CSS offset-path for the sliding dot along the rail.
 * ──────────────────────────────────────────────────────────────── */
function createSlugAnimation(
    nav: HTMLElement,
    tocItems: HTMLElement[],
    headings: TocHeading[],
): void {
    const list = nav.querySelector('#toc-list');
    if (!list) return;

    const levels = headings.map((h) => h.level);
    const pathWidth = levels.some((l) => l === 'h3') ? 24.5 : 16.5;

    // Compute item positions from DOM
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

    // Slug overlay container
    const slugContainer = document.createElement('div');
    slugContainer.setAttribute('class', 'absolute top-0 inset-s-0');
    slugContainer.style.width = `${pathWidth}px`;
    slugContainer.style.height = `${totalHeight}px`;
    slugContainer.style.setProperty('--track-top', '0px');
    slugContainer.style.setProperty('--track-bottom', '0px');
    slugContainer.style.setProperty('--offset-distance', '0px');
    slugContainer.style.setProperty('--opacity', '0');

    // Clipped SVG track — sharp rectangular clip
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', `0 0 ${pathWidth} ${totalHeight}`);
    svg.setAttribute('width', String(pathWidth));
    svg.setAttribute('height', String(totalHeight));
    svg.setAttribute('class', 'absolute transition-[clip-path]');
    svg.style.clipPath =
        'polygon(0 var(--track-top,0), 100% var(--track-top,0), 100% var(--track-bottom,0), 0 var(--track-bottom,0))';

    const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    pathEl.setAttribute('d', pathD);
    pathEl.setAttribute('stroke-width', '1');
    pathEl.setAttribute('fill', 'none');
    pathEl.setAttribute('stroke-linejoin', 'round');
    pathEl.setAttribute('stroke-linecap', 'round');
    pathEl.setAttribute('class', 'stroke-primary');
    svg.appendChild(pathEl);

    // Dot inside SVG — gets clipped by the same clip-path as the track
    const dotCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    dotCircle.setAttribute('r', '2');
    dotCircle.setAttribute('fill', 'var(--color-primary)');
    dotCircle.style.opacity = 'var(--opacity, 0)';
    svg.appendChild(dotCircle);

    slugContainer.appendChild(svg);
    list.appendChild(slugContainer);

    // Compute total path length for dot positioning
    const pathLen = pathEl.getTotalLength();

    // Active index tracking
    let activeIndex = 0;

    function updateSlug(
        firstVisibleIndex: number,
        lastVisibleIndex: number,
    ): void {
        const trackTop = positions[firstVisibleIndex].top;
        const trackBottom = positions[lastVisibleIndex].bottom;
        // Clamp dot Y to stay within slider bounds
        let dotY = positions[activeIndex].mid;
        dotY = Math.max(trackTop, Math.min(trackBottom, dotY));

        // Map Y to path-length offset using binary search on the path
        const dotOffset = yToPathOffset(pathEl, dotY);

        slugContainer.style.setProperty('--track-top', `${trackTop}px`);
        slugContainer.style.setProperty('--track-bottom', `${trackBottom}px`);
        slugContainer.style.setProperty('--opacity', '1');

        // Position dot at the path-length offset
        const pt = pathEl.getPointAtLength(dotOffset);
        dotCircle.setAttribute('cx', String(pt.x));
        dotCircle.setAttribute('cy', String(pt.y));
    }

    nav.addEventListener('toc:active-change', (e: Event) => {
        const detail = (e as CustomEvent).detail as {
            index: number;
            visibleRange?: { first: number; last: number };
        };
        activeIndex = detail.index;
        if (detail.visibleRange) {
            updateSlug(detail.visibleRange.first, detail.visibleRange.last);
        } else {
            updateSlug(activeIndex, activeIndex);
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

/* Map a Y-coordinate to the nearest path-length offset by binary search */
function yToPathOffset(path: SVGPathElement, targetY: number): number {
    const total = path.getTotalLength();
    let lo = 0;
    let hi = total;
    while (hi - lo > 0.5) {
        const mid = (lo + hi) / 2;
        const pt = path.getPointAtLength(mid);
        if (pt.y < targetY) lo = mid;
        else hi = mid;
    }
    return (lo + hi) / 2;
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

    // Hide individual rail SVGs — the slug animation replaces them
    nav.querySelectorAll('.toc-rail-svg').forEach((svg) => {
        svg.style.display = 'none';
    });

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
document.addEventListener('htmx:after:swap', () => {
    setTimeout(initToc, 200);
}, true);
