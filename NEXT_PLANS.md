# Next Plans

## Completed (2026-06-23) — Mermaid.js + Genshin Aesthetic + CSS Grid + Dotted Borders + HTMX 4.0 Patterns + Dotwork + Fixes
- [x] Added Mermaid.js StreamField block (AOSMermaidBlock) with code editor, theme chooser (dark/light/forest/neutral)
- [x] Created mermaid Vite entry (assets/mermaid/mermaid.ts) with lazy-render on HTMX intersect
- [x] Mermaid diagrams lazy-render via `hx-trigger="intersect once"` + `hx-on::trigger` handler
- [x] Fixed mermaid oklch color error — now reads CSS variables from DaisyUI theme at runtime
- [x] Redesigned blog_page.html with dotwork tattoo aesthetic: SVG dot grids, geometric line rails, crosshair markers, corner dot accents
- [x] Redesigned blog_index_page.html with matching dotwork aesthetic: background dot grid, vertical rails, corner accents, dotwork separators
- [x] AOS timing fixed — fires on DOMContentLoaded + requestAnimationFrame (no window.load delay, CSS loads first in head)
- [x] NProgress bar fixed — no spring-back, animates 0%→45%→60%→95%→fade out, resets instantly on next show
- [x] Avatar ring fixed — rounded-full ring matches mask-circle image
- [x] Color scheme updated to orange + purple (primary: purple oklch(62% 0.22 295), accent: orange oklch(70% 0.22 35))
- [x] Removed unnecessary bottom decorative band from blog_page.html
- [x] Migration 0008 created and applied for new StreamField block
- [x] Genshin Impact / anime aesthetic applied across blog pages — constellation rails, ornamental dividers, crown ornaments, crystal frames
- [x] All borders converted to dotted (`border-dotted`) for ornamental, anime-style framing
- [x] CSS Grid layout for blog_page.html — `grid-cols-[auto_1fr_auto]` for rails + content, `grid-cols-[auto_1fr]` for TOC + body
- [x] Feminine icon set — `sparkles`, `infinity`, `gem`, `star`, `compass`, `cross`, `prism`, `orbit`, `crown` replace harsh geometric icons
- [x] Added new Lucide icons to registry: `flower`, `heart`, `infinity`, `moon-star`, `star`, `diamond`, `crown`, `feather`, `droplet`, `flame`, `leaf`, `zap`, `orbit`, `prism`, `cross`, `sunrise`, `atlas`
- [x] Fixed wagtail userbar HTMX re-render error — proper `HtmxDetectMiddleware` sets `request.is_htmx` from `HTTP_HX_REQUEST` meta, template guard uses `{% if not request.is_htmx %}`
- [x] Compass at end marker repositioned to sit cleanly above dotted border with `bg-base-100` backdrop
- [x] Theme toggle now persists across page loads via `localStorage` + inline `<script>` in `<head>` to prevent flash of wrong theme
- [x] Added bulletin board thumbtack pins to sidebar cards — 4 colored pins (red/blue/amber/emerald) in each corner
- [x] Added transition to BLOG placeholder hover glow — `transition-colors duration-300 group-hover:text-secondary/20`
- [x] Homepage redesigned with dotwork aesthetic — constellation dots, dot ornaments, dot corner accents on cards, dot separators

## Completed
- [x] Migrated to HTMX 4.0.0-beta4 (from 2.0.10) - all event names, attributes, config updated
- [x] Fixed Vite config path (`./assets/tailwind.css` → `./assets/tailwind/tailwind.css`)
- [x] Fixed infinite scroll - `hx-swap="outerHTML"` with new trigger in response, `hx-trigger="intersect"` (HTMX 4.x)
- [x] Synced partial layout with main template (data-aos, decorative lines, alternating rows, text-xl intro)
- [x] Added HTMX 4.x lazy-load pattern for tag cloud sidebar
- [x] Updated all HTMX event names: `htmx:beforeRequest` → `htmx:before:request`, `htmx:afterRequest` → `htmx:after:request`, `htmx:swapComplete` → `htmx:after:swap`
- [x] Removed `hx-history` attribute, `hx-on::click` → `onclick`, popstate buffer removed
- [x] Verified partial view handles tag+mood filter combinations
- [x] Verified lazy-loaded tag cloud endpoint works
- [x] Removed duplicate back links on blog page (kept top "Back to blog" only)
- [x] Fixed text readability on blog page (reduced spacing)
- [x] Replaced Lucide JS icons with server-rendered `{% icon %}` template tag (zero JS, no tree-shaking issues, ~380 KB bundle removed)
- [x] Removed dead code: lucide npm package, lucide.ts, icons.py, dead AOS handler in htmx.ts

## Active Issues
- [x] HTMX 4 content flash — applied fix with `:inherited` modifiers + safety net handler (verify in browser)

## Completed (2026-06-06) — Wagtail 7.3 Best Practices
- [x] Removed deprecated `XFrameOptionsMiddleware` (unused since Wagtail 4.0)
- [x] Removed `USE_I18N = True` (always True since Django 5.1)
- [x] Added `WAGTAILIMAGES_MAX_IMAGE_PIXELS` for image upload security
- [x] Added `editor_panels` with Content/Promote/Settings tabs to all Page models (BlogIndexPage, BlogPage, HomePage, ProjectIndexPage, ProjectPage)
- [x] Removed redundant `use_json_field=True` from StreamField (default since Wagtail 5.x)
- [x] Added `group` to all AOS blocks (Content, Media, Layout, Interactive) for admin auto-grouping
- [x] Added `search_fields` to all Page models (HomePage, BlogIndexPage, ProjectIndexPage, ProjectPage)
- [x] Fixed `parent_page_types` to use class references where possible
- [x] Optimized RSS feed to cache `Site.find_for_request` lookup
- [x] Tightened `ALLOWED_HOSTS` in dev settings
- [x] Set `WAGTAILADMIN_BASE_URL` in dev settings
- [x] Added labels to basic blocks (Paragraph, Image)

## Completed (2026-06-07) — Wagtail Best Practices + DaisyUI Components
- [x] Removed duplicate `WAGTAILSEARCH_BACKENDS` from base.py
- [x] Added `WAGTAILADMIN_RICH_TEXT_FEATURES` global feature config
- [x] Added `feature_names` restriction to all RichTextField instances (BlogIndexPage, HomePage, ProjectIndexPage, ProjectPage)
- [x] Removed type hints from CTABlock Meta class attributes
- [x] Added 5 new DaisyUI StreamField blocks: Tab Panel, Timeline, Steps, Alert, Tooltip
- [x] Created 5 block templates: aos_tab.html, aos_timeline.html, aos_steps.html, aos_alert.html, aos_tooltip.html
- [x] Rewrote navbar with DaisyUI navbar component (navbar-start, navbar-center, navbar-end)
- [x] Applied DaisyUI mask (mask-circle) to author avatar image
- [x] Added DaisyUI filter component to blog sidebar mood filter
- [x] Added missing icons to registry: circle, bookmark, history, message-circle, alert-circle
- [x] Wired all new blocks to BlogPage.body and HomePage.body StreamFields
- [x] Verified with `manage.py check` — zero model/import issues

## What to Do Next

### High Priority
- [ ] Add project pages (currently no ProjectIndexPage exists in DB)
- [ ] Add project pages (currently no ProjectIndexPage exists in DB)
- [ ] Add about/contact pages
- [ ] Optimize font loading (subset Bengali fonts, preload critical fonts)

## Notes
- HTMX 4.0.0-beta4 installed and configured
- `hx-trigger="intersect"` replaces `revealed` (fires once by default in 4.x)
- Event naming: `htmx:phase:action` format (e.g., `htmx:before:request`, `htmx:after:swap`)
- HTTP client changed from XMLHttpRequest to native `fetch()`
- History now re-fetches on back navigation (no localStorage cache)
- Vite config: separate `tailwind.css` entry, loaded directly via `{% vite_asset %}` in base.html head
- Template tag `image_colors` with filters: get_dominant_color, get_palette_colors, image_accent_color
- HTMX 4 key changes: settle delay 1ms (was 20ms), OOB after primary swap, error responses swap by default
