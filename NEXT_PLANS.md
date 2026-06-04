# Next Plans

## Completed
- [x] Removed all Svelte web components, replaced with Django templates + HTMX
- [x] Mood badge moved server-side via template tags
- [x] Footer sticks to bottom via flexbox, no duplicate branding
- [x] Nav URLs resolved once, passed through navbar/mobile menu/footer
- [x] Search button visibility controlled server-side
- [x] AOS blocks added to StreamField (heading, quote, highlight, separator, image)
- [x] AOS init on DOMContentLoaded for direct page visits
- [x] Font system: Plus Jakarta Sans, Inter, Hind Siliguri (Bengali), JetBrains Mono (code)
- [x] All fonts via npm, zero CDN, no fallbacks
- [x] Tailwind loaded first in head to prevent flash of unstyled content
- [x] Blog posts inlined into blog index page, removed partial
- [x] tsconfig migrated to TS7+ compatible (removed deprecated baseUrl)
- [x] Minimal inline JS (theme toggle, keyboard shortcuts, mobile menu)

## Remaining Tasks

### Critical
- [x] Migrate blog_page.html TOC to server-side rendering (2026-06-04)
- [x] Add AOS blocks to home page StreamField (2026-06-04)
- [x] Fix navbar dropdown issue (2026-06-04)
- [x] Test HTMX boost navigation end-to-end (2026-06-04)
- [x] Verify search modal works with HTMX (2026-06-04)

### High Priority
- [x] Add more AOS block types: callout, stats grid, card grid (2026-06-04)
- [ ] Optimize font loading (subset Bengali fonts, preload critical fonts)
- [ ] Add project pages (currently no ProjectIndexPage exists in DB)
- [ ] Add about/contact pages
- [x] Remove unused Svelte assets from disk (2026-06-04)

### Medium Priority
- [ ] Add tag filter via HTMX (currently server-side only)
- [x] Add reading progress bar for blog pages (2026-06-04)
- [x] Add smooth scroll behavior for TOC links (2026-06-04)
- [x] Add dark/light mode transition animation (2026-06-04)
- [x] Add 404/500 page styling (2026-06-04)

### Low Priority
- [x] Add RSS feed support (2026-06-04) — BlogRSSFeed at /feed/ and /rss/
- [x] Add sitemap.xml (2026-06-04) — already wired via Wagtail sitemap view
- [x] Add Open Graph meta tags (2026-06-04) — OG + Twitter Card in base.html head
- [x] Add structured data (JSON-LD) (2026-06-04) — BlogPosting schema on blog pages

## Session 2026-06-04 Summary (cont.)
- Removed reading progress bar per user request
- Added nprogress-style navigation progress bar (shows during HTMX requests)
- HTMX infinite scroll for blog pagination (hx-trigger="revealed" + partial view)
- Removed `from __future__ import annotations` from all Python files (Python 3.14+ has PEP 563)
- Added "no inline style" and "always @apply" rules to CLAUDE.md
- Note: HTMX lazy-load (`hx-trigger="load"`) is for content fetching, not animations — AOS serves different purpose (scroll animations). They are complementary, not replacements.
- Note: HTMX v4 migration changes: `hx-trigger="revealed"` → `"intersect once"`, implicit inheritance removed, `hx-disable` → `hx-ignore`, native fetch() API
- Template tag `image_colors` with filters: get_dominant_color, get_palette_colors, image_accent_color
