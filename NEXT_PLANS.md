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

## Active Issues
- [ ] HTMX 4 content flash after boosted navigation — content appears then disappears (see PLANS.md for details)

## What to Do Next

### High Priority
- [ ] Fix HTMX 4 content flash (settle + AOS interaction)
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
