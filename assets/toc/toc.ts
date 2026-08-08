interface TocHeading {
    id: string;
    element: HTMLElement;
    link: HTMLAnchorElement;
    level: string;
}

function initToc(): void {
    const content = document.getElementById('article-content');
    const nav = document.getElementById('toc-nav');
    if (!content || !nav) return;

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

    // Scroll-spy via IntersectionObserver
    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;

                const currentIndex = headings.findIndex(
                    (h) => h.id === entry.target.id,
                );
                if (currentIndex === -1) continue;

                // Update active state — data-active attribute drives CSS
                headings.forEach((h, i) => {
                    const isActive = i === currentIndex;
                    h.link.setAttribute('data-active', String(isActive));
                });
            }
        },
        { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.2, 0.5, 1] },
    );

    headings.forEach((h) => {
        if (h.element && h.element.isConnected) {
            observer.observe(h.element);
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

        // Align TOC with the first heading by adding top padding to the aside
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
