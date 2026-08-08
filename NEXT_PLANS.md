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
- [x] TOC vertically aligned with first heading — JS measures offset and adds paddingTop to aside, first h2 skipped from TOC (page title)

## Pending

### Content
- [ ] Create project pages (ProjectIndexPage not in DB)
- [ ] Add about/contact pages

### Optimization
- [ ] Optimize font loading (subset Bengali fonts, preload critical fonts)
