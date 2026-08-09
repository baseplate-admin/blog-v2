# Next Plans

## Completed
- [x] Mermaid.js StreamField block with lazy-render on HTMX intersect
- [x] Genshin Impact / anime aesthetic across blog pages
- [x] CSS Grid layout, dotted borders, dotwork aesthetic
- [x] HTMX 4.0.0-beta4 migration with `:inherited` modifiers
- [x] Theme persistence via localStorage
- [x] Server-rendered `{% icon %}` template tag (replaced Lucide JS)
- [x] Wagtail 7.3 best practices (editor_panels, search_fields, etc.)
- [x] Backblaze B2 media storage with required env vars
- [x] Docker deployment fix - source `.env` at build time for collectstatic, `env_file` in compose
- [x] Conditional nav links, dj-database-url, per-post license selection
- [x] Requests-cache with Redis backend
- [x] Blocks refactoring, code block, AOS templates modularization
- [x] Fix copy button - moved inline onclick to JS handler in copy.ts (DOM clone approach, no JSON.parse)
- [x] Fix copy button not working — DOMContentLoaded timing fix for module scripts (was: `=== 'loading'`, now: `!== 'complete'`)
- [x] Remove info icon from code block footer, uniform footer spacing
- [x] TOC redesigned to match Takumi docs style — clean minimal links, data-active attribute, mask gradient fade animation, hidden scrollbar, H2/H3 indentation
- [x] TOC restructured to true Takumi docs layout — left-column sticky sidebar (self-start aside + inner sticky div), JS height sync, overflow-hidden removed from wrapper
- [x] TOC vertically aligned with first heading — JS measures offset and adds paddingTop to aside, first h2 skipped from TOC (page title)
- [x] TOC slug animation — Takumi docs-style sliding dot + clipped SVG track segment, follows active heading on scroll
- [x] TOC slug track dynamically grows/shrinks to cover all visible headings — IntersectionObserver tracks visible range, dot slides to active item
- [x] TOC active heading logic fixed — picks lowest heading still in viewport (largest top >= 0), last heading becomes active at bottom of page
- [x] TOC rootMargin fixed — '0px 0px -10% 0px' so slug track covers all visible headings
- [x] TOC scroll-spy rewritten to match Takumi docs — threshold-based algorithm (last heading whose top <= 100px is active), parent H2 propagation (H3 active also highlights preceding H2), first heading active on page load even when below viewport
- [x] TOC sticky fix — removed `lg:items-stretch` from grid (was: grid row stretch broke sticky positioning), set aside height to `auto` with `align-self: start`
- [x] Reading time icon — added `clock` icon beside reading time text (all templates: blog page, index, partial)
- [x] Date icon — added `calendar` icon beside publish date
- [x] Last updated indicator — shows "Updated M j, Y" when `last_published_at` differs from `date`, with `history` icon

## Pending

### Content
- [ ] Create project pages (ProjectIndexPage not in DB)
- [ ] Add about/contact pages

### Optimization
- [ ] Optimize font loading (subset Bengali fonts, preload critical fonts)
