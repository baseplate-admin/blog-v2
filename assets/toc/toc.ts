interface TocHeading {
    id: string;
    element: HTMLElement;
    link: HTMLAnchorElement;
    level: string;
}

let slugObserver: IntersectionObserver | null = null;

function buildPathD(itemMids: number[], totalHeight: number): string {
    const cx = 8.5;
    let d = `M ${cx} 0 L ${cx} ${itemMids[0]}`;
    for (const mid of itemMids) {
        d += ` C ${cx} ${(mid - 4).toFixed(1)} ${cx} ${(mid + 4).toFixed(1)} ${cx} ${(mid + 8).toFixed(1)}`;
    }
    d += ` L ${cx} ${totalHeight}`;
    return d;
}

function createSlugAnimation(
    nav: HTMLElement,
    tocItems: HTMLElement[],
    headings: TocHeading[],
): void {
    const list = nav.querySelector('#toc-list');
    if (!list) return;

    const pathWidth = 16.5;

    // --- Compute item positions from DOM ---
    function getItemPositions(): { top: number; mid: number; bottom: number }[] {
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
    const pathD = buildPathD(itemMids, totalHeight);

    // --- Slug overlay container ---
    const slugContainer = document.createElement('div');
    slugContainer.setAttribute('class', 'absolute top-0 inset-s-0 origin-center');
    slugContainer.style.width = `${pathWidth}px`;
    slugContainer.style.height = `${totalHeight}px`;
    slugContainer.style.setProperty('--track-top', '0px');
    slugContainer.style.setProperty('--track-bottom', '0px');
    slugContainer.style.setProperty('--offset-distance', '0px');
    slugContainer.style.setProperty('--opacity', '0');

    // --- Clipped SVG track ---
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
    pathEl.setAttribute('class', 'stroke-primary');
    svg.appendChild(pathEl);
    slugContainer.appendChild(svg);

    // --- Sliding dot ---
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

    // --- Active index tracking ---
    let activeIndex = 0;

    // --- Update slug position ---
    // The track segment spans from the first visible heading's TOC item
    // to the last visible heading's TOC item. The dot sits at activeIndex.
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

    // --- Track which headings are visible via IntersectionObserver ---
    // We use the scroll-spy observer (slugObserver) to know the active heading.
    // Additionally, we track all intersecting headings to compute the visible range.
    const visibleHeadingIds = new Set<string>();

    function computeVisibleRange(): { first: number; last: number } {
        if (!visibleHeadingIds.size) {
            return { first: 0, last: headings.length - 1 };
        }
        let first = 0;
        let last = headings.length - 1;
        for (let i = 0; i < headings.length; i++) {
            if (visibleHeadingIds.has(headings[i].id)) {
                first = i;
                break;
            }
        }
        for (let i = headings.length - 1; i >= 0; i--) {
            if (visibleHeadingIds.has(headings[i].id)) {
                last = i;
                break;
            }
        }
        return { first, last };
    }

    // Wire up toc:active-change to update dot + track
    nav.addEventListener('toc:active-change', (e: Event) => {
        const detail = (e as CustomEvent).detail as { index: number; visibleRange?: { first: number; last: number } };
        activeIndex = detail.index;
        if (detail.visibleRange) {
            updateSlug(detail.visibleRange.first, detail.visibleRange.last);
        } else {
            updateSlug(activeIndex, activeIndex);
        }
    });

    // --- Expose visibleHeadingIds for the scroll-spy to use ---
    (nav as HTMLElement).dataset.slugVisibleIds = 'true';

    // --- Initial setup ---
    const hashId = location.hash.slice(1);
    const initialIndex = hashId
        ? headings.findIndex((h) => h.id === hashId)
        : 0;
    activeIndex = initialIndex >= 0 ? initialIndex : 0;

    // Initially all headings are considered visible
    for (const h of headings) {
        visibleHeadingIds.add(h.id);
    }

    nav.dispatchEvent(new CustomEvent('toc:active-change', {
        detail: {
            index: activeIndex,
            visibleRange: { first: 0, last: headings.length - 1 },
        },
    }));
}

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

    // Assign IDs to headings that don't have one
    let idx = 0;
    headers.forEach((h) => {
        if (!h.id) h.id = `section-${idx++}`;
    });

    const tocLinks = Array.from(
        nav.querySelectorAll('.toc-link'),
    ) as HTMLAnchorElement[];

    const tocItems = Array.from(
        nav.querySelectorAll('[data-toc-item]'),
    ) as HTMLElement[];

    // Build heading lookup maps
    const headingById = new Map<string, HTMLElement>(
        headers.map((h) => [h.id, h]),
    );

    // Wire up link hrefs from data-target
    tocLinks.forEach((link) => {
        const targetId = link.getAttribute('data-target');
        const target = headingById.get(targetId ?? '');
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
            const target = headingById.get(id);
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
            const targetId = link.getAttribute('data-target');
            const element = headingById.get(targetId ?? '');
            if (!element) return null;
            return {
                id: targetId ?? '',
                element,
                link,
                level: link.getAttribute('data-level') ?? 'h2',
            };
        })
        .filter((h): h is TocHeading => h !== null);

    // Create slug animation
    createSlugAnimation(nav, tocItems, headings);

    // --- Scroll-spy: track visible headings and active heading ---
    const visibleHeadingIds = new Set<string>();
    let activeIndex = 0;

    slugObserver = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    visibleHeadingIds.add(entry.target.id);
                } else {
                    visibleHeadingIds.delete(entry.target.id);
                }
            }

            // Find active heading — the one with the largest top value >= 0
            // (i.e., the lowest heading whose top is still in the viewport)
            const intersectingHeadings = headings.filter(
                (h) => visibleHeadingIds.has(h.id),
            );
            if (intersectingHeadings.length) {
                const inView = intersectingHeadings.filter(
                    (h) => h.element.getBoundingClientRect().top >= 0,
                );
                const candidates = inView.length ? inView : intersectingHeadings;
                const newActive = candidates.reduce((best, h) => {
                    const rect = h.element.getBoundingClientRect();
                    const bestRect = best.element.getBoundingClientRect();
                    return rect.top > bestRect.top ? h : best;
                });
                const newIndex = headings.indexOf(newActive);

                // Update active state on links
                headings.forEach((h, i) => {
                    h.link.setAttribute('data-active', String(i === newIndex));
                });

                // Compute visible range
                let firstVisible = headings.length - 1;
                let lastVisible = 0;
                for (let i = 0; i < headings.length; i++) {
                    if (visibleHeadingIds.has(headings[i].id)) {
                        firstVisible = i;
                        break;
                    }
                }
                for (let i = headings.length - 1; i >= 0; i--) {
                    if (visibleHeadingIds.has(headings[i].id)) {
                        lastVisible = i;
                        break;
                    }
                }

                activeIndex = newIndex;
                nav.dispatchEvent(new CustomEvent('toc:active-change', {
                    detail: {
                        index: newIndex,
                        visibleRange: { first: firstVisible, last: lastVisible },
                    },
                }));
            }
        },
        { rootMargin: '0px 0px -10% 0px', threshold: [0, 0.05, 0.2, 0.5, 1] },
    );

    headings.forEach((h) => {
        if (h.element && h.element.isConnected) {
            slugObserver!.observe(h.element);
        }
    });

    // Set initial active state from hash or first heading
    const hashId = location.hash.slice(1);
    const initialIndex = hashId
        ? headings.findIndex((h) => h.id === hashId)
        : 0;

    if (initialIndex >= 0) {
        headings.forEach((h, i) => {
            h.link.setAttribute('data-active', String(i === initialIndex));
        });
    }

    // Make TOC aside as tall as the article so sticky works
    const aside = document.querySelector<HTMLElement>(
        'aside[data-aos="fade-right"]',
    );
    const article = document.querySelector<HTMLElement>('article');
    if (aside && article) {
        const articleRect = article.getBoundingClientRect();
        aside.style.height = articleRect.height + 'px';

        // Align TOC with the first heading by adding top padding
        const firstHeading = content.querySelector('h2, h3');
        if (firstHeading) {
            const articleTop = article.getBoundingClientRect().top;
            const headingTop = firstHeading.getBoundingClientRect().top;
            const offset = Math.max(0, headingTop - articleTop);
            aside.style.paddingTop = offset + 'px';
        }
    }
}

// Initial render — use DOMContentLoaded if document not yet complete
if (document.readyState !== 'complete') {
    document.addEventListener('DOMContentLoaded', initToc);
} else {
    initToc();
}

// Re-init after HTMX swaps
if ((window as any).htmx) {
    document.body.addEventListener('htmx:after:swap', () => {
        requestAnimationFrame(initToc);
    });
}
