// TOC scroll-spy + smooth-scroll
function initToc() {
    const content = document.getElementById('article-content');
    const nav = document.getElementById('toc-nav');
    if (!content || !nav) return;

    const headers = Array.from(content.querySelectorAll('h2,h3'));
    if (!headers.length) {
        nav.style.display = 'none';
        return;
    }

    let idx = 0;
    headers.forEach(h => { if (!h.id) h.id = `section-${idx++}`; });

    const tocLinks = nav.querySelectorAll('.toc-link');
    const headingById = new Map(headers.map(h => [h.id, h]));
    const headingByText = new Map(headers.map(h => [h.textContent.trim(), h]));

    tocLinks.forEach(link => {
        const targetId = link.getAttribute('data-target');
        let target = headingById.get(targetId);
        if (!target) target = headingByText.get(link.textContent.trim());
        if (target) link.setAttribute('href', `#${target.id}`);
    });

    tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const id = link.getAttribute('href').slice(1);
            const target = headingById.get(id);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                history.replaceState(null, '', `#${id}`);
            }
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                tocLinks.forEach(link => {
                    const match = link.getAttribute('href') === `#${entry.target.id}`;
                    link.classList.toggle('text-primary', match);
                    link.classList.toggle('border-primary', match);
                    link.classList.toggle('border-transparent', !match);
                });
            }
        },
        { rootMargin: '0px 0px -65% 0px', threshold: [0, 0.2, 1] }
    );

    headers.forEach(h => observer.observe(h));
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
