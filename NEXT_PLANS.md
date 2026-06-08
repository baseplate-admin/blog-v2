# Next Plans

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
