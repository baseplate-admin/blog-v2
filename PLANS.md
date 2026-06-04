# Plans

## HTMX 4 Migration — In Progress

### Current State
- HTMX 4.0.0-beta4 installed and configured
- All event names migrated (`htmx:phase:action` format)
- Config keys updated (`defaultTimeout`, `defaultSwap`, `history`)
- `implicitInheritance: true` enabled for HTMX 2 compatibility

### Known Issue: Content flash after boosted navigation
- **Symptom:** Blog index posts appear briefly then disappear after clicking a boosted link
- **Root cause (suspected):** HTMX 4 settle phase + AOS interaction
  - HTMX 4 `defaultSettleDelay` is 1ms (was 20ms in HTMX 2)
  - AOS hides `data-aos` elements on DOM insert; refresh timing off after swap
  - HTMX 4 OOB swaps now run AFTER primary swap (reversed from HTMX 2)
- **Fixes attempted:**
  - [x] Set `defaultSettleDelay: 10` in config
  - [x] Added `noSwap: [204, 304, '4xx', '5xx']`
  - [x] Added `hx-swap="innerHTML"` to boost wrapper
  - [x] Forced `detail.swap = 'innerHTML'` in `htmx:before:swap` handler
  - [x] AOS fix: pre-mark elements, force `aos-animate` for visible elements
  - [x] Removed `hx-swap-oob` from title (OOB timing changed in HTMX 4)
- **Next steps:**
  - [ ] Test with `hx-swap="innerHTML:noSettle"` to fully disable settle
  - [ ] If noSettle doesn't work, consider downgrading to HTMX 2 until beta stabilizes
  - [ ] Alternative: use `hx-push-url` + manual fetch instead of boost

### Other Completed Fixes
- [x] Duplicate back links on blog page (removed bottom link, kept top)
- [x] Mood badge on blog page (already dynamic via template tag)
- [x] Text readability on blog page (reduced spacing, fixed w-2/5 width issue)

## Pending Work

### Blog Index Page
- [ ] Fix HTMX 4 content flash (see above)
- [ ] Verify infinite scroll works after HTMX 4 changes
- [ ] Verify tag/mood filters work after HTMX 4 changes

### Projects Page
- [ ] Create project listing with GitHub API integration
- [ ] Add tag-based filtering/sorting
- [ ] Add custom tag logos

### General
- [ ] Add about/contact pages
- [ ] Optimize font loading (subset Bengali fonts, preload critical)
- [ ] Update CLAUDE.md with HTMX 4 changes
