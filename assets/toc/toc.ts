interface TocHeading {
    id: string;
    element: HTMLElement;
    link: HTMLAnchorElement;
    level: string;
}

let slugObserver: IntersectionObserver | null = null;

/* ── SVG rail path builder ─────────────────────────────────────── */
// Builds a smooth path that runs down the H2 column (x=8.5), curves into
// the H3 column (x=16.5) at H3 items, and back to H2 at H2 items.
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
            // Curve from H2 column (8.5) to H3 column (16.5)
            d += ` C 8.5 ${(mid - 4).toFixed(1)} 16.5 ${(mid - 1).toFixed(1)} 16.5 ${(mid + 2).toFixed(1)}`;
            d += ` L 16.5 ${(mid + 6).toFixed(1)}`;
        } else {
            // Stay on H2 column
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
    slugContainer.setAttribute(
        'class',
        'absolute top-0 inset-s-0 origin-center',
    );
    slugContainer.style.width = `${pathWidth}px`;
    slugContainer.style.height = `${totalHeight}px`;
    slugContainer.style.setProperty('--track-top', '0px');
    slugContainer.style.setProperty('--track-bottom', '0px');
    slugContainer.style.setProperty('--offset-distance', '0px');
    slugContainer.style.setProperty('--opacity', '0');

    // Clipped SVG track
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

    // Sliding dot
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

    nav.appendChild(slugContainer);

    // Active index tracking
    let activeIndex = 0;

    function updateSlug(
        firstVisibleIndex: number,
        lastVisibleIndex: number,
    ): void {
        const trackTop = positions[firstVisibleIndex].top;
        const trackBottom = positions[lastVisibleIndex].bottom;
        const dotMid = positions[activeIndex].mid;

        slugContainer.style.setProperty('--track-top', `${trackTop}px`);
        slugContainer.style.setProperty('--track-bottom', `${trackBottom}px`);
        slugContainer.style.setProperty('--offset-distance', `${dotMid}px`);
        slugContainer.style.setProperty('--opacity', '1');
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

/* ── Curved SVG paths for H3 items that follow H2 ──────────────── */
function injectH3Curves(nav: HTMLElement): void {
    const links = Array.from(nav.querySelectorAll('.toc-link')) as HTMLAnchorElement[];
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        const level = link.getAttribute('data-level') ?? 'h2';
        if (level !== 'h3') continue;

        // Check if previous heading was an H2
        const prevLevel = (links[i - 1]?.getAttribute('data-level') ?? 'h2');
        if (prevLevel !== 'h2') continue;

        // Replace the straight line with a curve + line
        const svg = link.querySelector<SVGSVGElement>('svg[data-rail-svg]');
        if (!svg) continue;

        // Clear existing content and add curve + vertical line
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

    // Clean up previous slug animation and observer
    const existingSlug = nav.querySelector('div.absolute.top-0.inset-s-0');
    if (existingSlug) existingSlug.remove();
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

    // Inject curved SVG paths for H3 items that follow H2
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

    // Wire up link hrefs
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

    // Build structured heading list for scroll-spy
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

    // Create slug animation
    createSlugAnimation(nav, tocItems, headings);

    // Scroll-spy: track visible headings and active heading
    let rafId: number | null = null;

    function updateScrollSpy(): void {
        const viewportTop = 0;
        const viewportBottom = window.innerHeight;

        const visibleHeadings: TocHeading[] = [];
        for (const h of headings) {
            const rect = h.element.getBoundingClientRect();
            const center = rect.top + rect.height / 2;
            if (center >= viewportTop && center <= viewportBottom) {
                visibleHeadings.push(h);
            }
        }

        if (visibleHeadings.length) {
            const inView = visibleHeadings.filter(
                (h) => h.element.getBoundingClientRect().top >= 0,
            );
            const candidates = inView.length ? inView : visibleHeadings;
            const newActive = candidates.reduce((best, h) => {
                const rect = h.element.getBoundingClientRect();
                const bestRect = best.element.getBoundingClientRect();
                return rect.top > bestRect.top ? h : best;
            });
            const newIndex = headings.indexOf(newActive);

            // Update data-active attribute on all links
            headings.forEach((h, i) => {
                h.link.setAttribute('data-active', String(i === newIndex));
            });

            const firstVisible = headings.indexOf(visibleHeadings[0]);
            const lastVisible = headings.indexOf(
                visibleHeadings[visibleHeadings.length - 1],
            );

            nav.dispatchEvent(
                new CustomEvent('toc:active-change', {
                    detail: {
                        index: newIndex,
                        visibleRange: {
                            first: firstVisible,
                            last: lastVisible,
                        },
                    },
                }),
            );
        }
    }

    slugObserver = new IntersectionObserver(
        () => {
            if (rafId !== null) cancelAnimationFrame(rafId);
            rafId = requestAnimationFrame(updateScrollSpy);
        },
        { rootMargin: '-40% 0px -20% 0px', threshold: [0] },
    );

    headings.forEach((h) => {
        if (h.element && h.element.isConnected) {
            slugObserver!.observe(h.element);
        }
    });

    // Initial call
    updateScrollSpy();

    // Set initial active state from hash
    const hashId = location.hash.slice(1);
    const initialIndex = hashId
        ? headings.findIndex((h) => h.id === hashId)
        : 0;

    if (initialIndex >= 0) {
        headings.forEach((h, i) => {
            h.link.setAttribute('data-active', String(i === initialIndex));
        });
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
