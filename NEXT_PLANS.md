# Next Plans

## Completed
- [x] Migrated to HTMX 4.0.0-beta4 (from 2.0.10) - all event names, attributes, config updated
- [x] Fixed Vite config path (`./assets/tailwind.css` → `./assets/tailwind/tailwind.css`)
- [x] Fixed infinite scroll - `hx-swap="outerHTML"` with new trigger in response, `hx-trigger="intersect"` (HTMX 4.x)
- [x] Synced partial layout with main template (data-aos, decorative lines, alternating rows, text-xl intro)
- [x] Added HTMX 4.x lazy-load pattern for tag cloud sidebar
- [x] Updated all HTMX event names: `htmx:beforeRequest` → `htmx:before:request`, `htmx:afterRequest` → `htmx:after:request`, `htmx:swapComplete` → `htmx:after:swap`, `htmx:afterSettle` → removed
- [x] Removed `hx-history` attribute (no longer needed in HTMX 4.x)
- [x] Updated HTMX config: `historyEnabled` → `history`, removed deprecated options

## What to Do Next

### Immediate
- [ ] Test infinite scroll end-to-end (scroll multiple pages, verify spinner shows, no content loss)
- [ ] Verify blog detail page grid lines render correctly on dark/light themes
- [ ] Check that partial view handles tag+mood filter combinations
- [ ] Verify lazy-loaded tag cloud works correctly

### High Priority
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
