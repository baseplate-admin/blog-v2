# Next Plans

## What to Do Next

### Immediate
- [ ] Test infinite scroll end-to-end (scroll multiple pages, verify spinner shows, no content loss)
- [ ] Verify blog detail page grid lines render correctly on dark/light themes
- [ ] Check that partial view handles tag+mood filter combinations

### High Priority
- [ ] Add project pages (currently no ProjectIndexPage exists in DB)
- [ ] Add about/contact pages
- [ ] Optimize font loading (subset Bengali fonts, preload critical fonts)

### Medium Priority
- [ ] Add tag filter via HTMX (currently server-side only)
- [ ] Add blog comments system

## Notes
- HTMX v4 migration changes: `hx-trigger="revealed"` → `"intersect once"`, implicit inheritance removed, `hx-disable` → `hx-ignore`, native fetch() API
- Vite config: separate `tailwind.css` entry, loaded directly via `{% vite_asset %}` in base.html head
- Template tag `image_colors` with filters: get_dominant_color, get_palette_colors, image_accent_color
