# Plans

## HTMX 4 Migration — Fix Applied

### Root Cause
HTMX 4 boosted navigation swaps into `<body>` by default. In HTMX 2, attribute inheritance was implicit, so `hx-target="main"` on the boost container cascaded to child links. HTMX 4 requires explicit `:inherited` modifiers.

### Applied Fix
- Added `:inherited` modifiers to boost container attributes:
  - `hx-boost:inherited="true"`
  - `hx-target:inherited="main"`
  - `hx-select:inherited="main"`
  - `hx-swap:inherited="innerHTML"`
- Added `hx-on::before:swap` safety net handler on container to force target to `<main>` if HTMX defaults to `<body>`
- Added JS event handler in `htmx.ts` as backup
- Removed `implicitInheritance: true` (explicit inheritance used instead)
- AOS: force `aos-animate` on visible elements after swap
- `noSwap: [204, 304, '4xx', '5xx']` to prevent error responses from swapping

### Files Changed
- `core/templates/base.html` — boost container attributes, hx-on handler
- `assets/htmx/htmx.ts` — config, event handler
- `assets/aos/aos.ts` — post-swap handler

### Pending Verification
- [ ] Test in browser to confirm content no longer disappears
- [ ] Verify back/forward navigation works
- [ ] Verify infinite scroll still works

## Other Completed Fixes
- [x] Duplicate back links on blog page (kept top "Back to blog" only)
- [x] Text readability on blog page (reduced spacing)
- [x] Mood badge on blog page (dynamic via template tag)

## Pending Work

### Projects Page
- [ ] Create project listing with GitHub API integration
- [ ] Add tag-based filtering/sorting
- [ ] Add custom tag logos

### General
- [ ] Add about/contact pages
- [ ] Optimize font loading (subset Bengali fonts, preload critical)
