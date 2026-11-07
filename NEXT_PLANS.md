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
- [x] Code cleanup pass — font names, nprogress-bar CSS, inline styles in templates, `window as any`, file renaming
- [x] Reading time icon — added `clock` icon beside reading time text (all templates: blog page, index, partial)
- [x] Date icon — added `calendar` icon beside publish date
- [x] Last updated indicator — shows "Updated M j, Y" when `last_published_at` differs from `date`, with `history` icon

## Completed
- [x] Font migration — removed @fontsource npm packages, self-hosted fonts in public/fonts/ subdirectories (twemoji approach), full unicode-range @font-face in tailwind.css
- [x] TOC SVG rail path rewritten — sharp quadratic curves matching Takumi docs style (H2 straight vertical, H3 curve out/in), slug track uses stroke-dasharray/dashoffset on SVG path (follows exact rail curve)
- [x] Fonts split from tailwind.css — @font-face declarations moved to assets/tailwind/fonts.css, imported via @import
- [x] TypeScript fix — htmx.ts progress bar functions cast querySelector to HTMLElement for .style access

## Inertia + Svelte migration (2026-11-05)

### Completed
- [x] Full pivot: Django templates + HTMX boost -> Inertia.js + Svelte 5
- [x] Server: `inertia-django` (v2.0.0) - `inertia.render()`, `InertiaMiddleware`, `INERTIA_LAYOUT="base.html"`
- [x] Client: `@inertiajs/svelte` (v3.11.0) + `createInertiaApp` + `import.meta.glob` page resolver
- [x] Svelte 5: `$props()`, `$state`, `$derived`, Snippet, `{@render}` throughout
- [x] shadcn-svelte (hand-written, bits-ui + cva + cn) - button, badge, card, separator, tabs, tooltip, alert
- [x] lucide-svelte (v1.0.1) Icon wrapper with server-name -> component map
- [x] Mood/license badges resolved client-side from keys (web/src/lib/badges.ts); serializers now send only mood/license_type + label, color maps dropped from the wire
- [x] All 7 Svelte pages: Home, BlogIndex, BlogPage, ProjectIndex, ProjectPage, Generic, NotFound
- [x] All StreamField block components (BlockRenderer dispatcher)
- [x] AOS scroll animations reimplemented via IntersectionObserver (no AOS lib)
- [x] TOC scroll-spy (threshold-based, H2 propagation)
- [x] Reading progress bar (BlogPage)
- [x] Code copy button (Code.svelte)
- [x] Mermaid lazy-render (Mermaid.svelte)
- [x] Mermaid code-split via dynamic `import("mermaid")` (adopted @friendofsvelte/mermaid approach, kept mermaid 11)
- [x] Theme toggle + init (no flash)
- [x] base.html rewritten as minimal Inertia layout (head + SEO/OG + vite_asset + inertia block)
- [x] `mixins/inertia/base.py` - `InertiaMixin` inspects the page class at inheritance, injects `serve()`, and auto-dumps model fields + `get_context()` at runtime (StreamField blocks as `{type, value}`); generic meta/nav from the page instance + `<app>.inertia::shared_props` hooks (e.g. `apps/site_settings/inertia.py`); no per-page or per-block serializer files
- [x] Vite config: single entry `web/src/main.ts`, Svelte plugin, Tailwind plugin
- [x] Build verified: `npm run build` -> `static/assets/main-*.js` + CSS
- [x] Runtime verified: home page 200, Inertia payload with correct props

### Pending

#### Content
- [x] Create BlogIndexPage in DB (nav URLs resolve)
- [x] Create ProjectIndexPage + 3 sample ProjectPages in DB (`/projects/`, `/projects/blog-engine/`, `/projects/color-thief-cli/`, `/projects/dev-notes/`); two featured, surfaced on the homepage
- [x] Create sample BlogPages (2 exist) to verify article rendering
- [ ] Add about/contact pages
- [x] **Fix project serializer 500s** — `RichTextField` stores a string, not a `RichText` object; `serialize_project_index`/`serialize_project_page` were reading `page.intro.html`/`page.description.html` (AttributeError). Now read the string directly. Also normalized `projects` to `{url,title,intro}` dicts so `ProjectIndex.svelte` gets the shape it expects. Verified all project routes + home featured list over HTTP (200).

#### Optimization
- [x] Code-split main bundle (main now ~372 kB / gzip 111 kB; mermaid engines in lazy chunks)
- [x] Lazy-load mermaid chunk (dynamic import in Mermaid.svelte)
- [x] Font loading - `@fontsource-variable` bundles via Vite with `unicode-range` subsetting (only the Latin subset downloads on first load); dead `public/fonts/` (3.1 MB) + `assets/tailwind/fonts.css` removed

#### Cleanup
- [x] Remove obsolete: `assets/` (htmx/aos/toc/copy/mermaid/theme/tailwind)
- [x] Remove old Django templates: `apps/blog/templates/` (old HTMX partials + block templates)
- [x] Remove `scripts/port_icons.py` (one-off)
- [x] Remove `web/src/lib/icons.ts` (replaced by lucide-svelte)
- [x] Remove dead `blog_page_partial` view + `blog/load-more/` URL (HTMX load-more, superseded by Inertia pagination). Kept `author_avatar` (still used by BlogPage)
- [x] Remove `core/templates/components/` (old navbar/footer, replaced by Svelte)
- [x] Remove `core/templates/404.html` + `500.html` (old Django templates, replaced by `NotFound.svelte`)
- [x] Remove `apps/search/` app (HTMX partial search; no Inertia search page exists yet) + drop from INSTALLED_APPS + remove `/search/` URL
- [x] Search modal: `/search/` Inertia page (`SearchPage.svelte`) + lean `apps/search/` (one DB query, no search index/cache, no Wagtail page). Post list preloaded once, filtered client-side (instant). Navbar search button + Ctrl/Cmd+K shortcut. Server-side `?q=` filter also works. Keyboard: arrows to navigate, Enter to open, Esc to close
- [x] Remove dead `HtmxDetectMiddleware` (`core/middleware.py`) + `is_htmx` context var; zero HTMX refs remain in live code

### Svelte 5 idiom audit (2026-11-05)
Audited all Svelte components against the official Svelte 5 LLM docs (svelte.dev/docs/svelte/llms.txt) and modernized every deviation.

#### Completed
- [x] **Window listeners via `svelte/events`** — replaced `onMount` + manual `addEventListener`/`removeEventListener` with `on(window, ...)` inside `$effect` (Toc scroll-spy, BlogPage reading progress). Docs: prefer `on()` over manual add/remove; `$effect` cleanup detaches.
- [x] **No effects to synchronise state** — removed the anti-pattern `$effect(() => { isDark = document... })` in Navbar. Now: `isDark = $state(read once)` + `toggle()` flips the class and re-reads `isDark` directly (no effect writing to state).
- [x] **Keyed each blocks** — added a unique key to every unkeyed `{#each}` (dropped bare/implicit iteration). Kept the `i` index only where used for AOS `delay={i * N}`. Keyed by a stable field (url, label, name, value, title, step, card.title), never by index alone.
- [x] **`{const}` declaration tag** — `{@const badge = moodBadge(mood.value)}` (legacy) -> `{const badge = ...}` (Svelte 5.56+ syntax).
- [x] **Dedup identical `{#if}/{:else}` branches** — PostCard: the `{#if post.cover}{CardHeader}{:else}{CardHeader}{/if}` had byte-identical branches, collapsed to a single unconditional `<CardHeader>`.
- [x] **Verified** — `svelte-check` 0 errors / 0 warnings; `npm run build` succeeds; runtime smoke test (home + blog index) clean, only pre-existing `localhost:5173` dev-asset 404 (Vite dev-server URL ref, unrelated).

#### Not changed (justified)
- Mermaid.svelte `onMount` — legitimate one-time mount for lazy `import("mermaid")` + IntersectionObserver; left as-is.
- Render.svelte still uses `{@const SvelteComponent}` + unkeyed `{#each children}` — noted as a future-cleanup candidate (component is not in the live page path).

## Twemoji via vendored SVGs (2026-11-06)

Approach: keep the Twemoji SVGs as vendored source under `web/src/vendor/twemoji/svg/`, eagerly `import.meta.glob` them as raw strings into `main.js`, and render them inline. (Two earlier iterations were discarded: (1) converting them into `web/src/emojis/*.svelte` Svelte components + a lazy `import.meta.glob`; (2) an `<img>`-based `Emoji.svelte`. The final version reads the eager glob map and inlines it via `@html` so it can be CSS-styled.)

#### Completed
- [x] `web/src/vendor/twemoji/svg/` — all 3,689 Twemoji SVGs (CC-BY 4.0), eagerly imported via `import.meta.glob(..., { eager: true, query: '?raw' })` into `main.js`.
- [x] `web/src/lib/Emoji.svelte` — **inlines** the Twemoji SVG from the eager glob map and injects the markup via `@html`, so it can be styled with CSS (width/height, `filter`, `clip-path`, opacity). Accepts `value="✨"` (emoji char) or `codepoint="1f1e8-1f1f3"` (hex). Default class `inline h-[1.2em] w-[1.2em] align-[-0.15em]` for inline text alignment; any class overrides. Uses the `twemoji` npm package **only** for `twemoji.convert.toCodePoint()` (char -> hex; no network). **Gotcha:** twemoji v14 ESM is `export default` only, so default-import it (`import twemoji from 'twemoji'`). Verified in Node: `✨`->2728, `🔥`->1f525, `🇨🇩`->1f1e8-1f1e9, `👍🏽`->1f44d-1f3fd.
- [x] Removed `web/src/emojis/` (3,689 generated Svelte components) — no longer needed.
- [x] `svelte-emoji-picker` was briefly installed then removed (not allowed). Only `twemoji` remains as a dependency.
- [x] `web/src/lib/twemoji.ts` (a `use:twemoji` action for replacing emoji in server-rendered StreamField text) was started but is **not wired in** and had type errors; removed. Rebuild it if/when you want emoji in post bodies to render as Twemoji SVGs instead of native OS emoji.

#### Open
- [x] Home hero uses `<Emoji>`; the SVG comes from the eager glob map (no network request).
- [ ] Consider CC-BY 4.0 Twemoji attribution (graphics are CC-BY licensed; Twemoji recommends crediting "Twemoji icons (CC-BY 4.0)"). Not yet added anywhere.
- [ ] Note: all 3,689 SVGs are bundled into `main.js` (~9.2 MB / ~1.75 MB gzip) even if unused. This is intentional (single large main, no per-emoji requests); flag if it ever becomes a problem.

## Inertia layout / base.html (2026-11-06)

The site renders through Inertia + Svelte (single stack). The old HTMX/Django-template render path is **not** active; those `.html` templates were removed from the working tree (they remain in git history if you ever want to compare).

#### How the layout works (final)
- [x] `core/templates/base.html` — **minimal Inertia layout** per inertia-django's own examples: `<head>` (charset, viewport, `{% vite_asset 'web/src/main.ts' %}`) + `<body>{% block inertia %}{% endblock %}`. inertia-django extends this template and injects `<script data-page="app">…</script><div id="app"></div>` into the `{% block inertia %}`.
- [x] `<title>` + Open Graph + Twitter meta are managed by **`<svelte:head>` in `web/src/layouts/DefaultLayout.svelte`** (reads the `meta` prop). Svelte-idiomatic, stays correct across SPA navigations automatically. The layout template does not duplicate them.
- [x] `web/src/main.ts` — `createInertiaApp` with `resolve` (page glob) + `layout: DefaultLayout` + `progress` bar + `initTheme()` before first paint. No `serverHead` (the `<svelte:head>` in the layout covers it).
- [x] `svelte-check` clean (0 errors / 0 warnings). All routes 200: `/`, `/blog/`, `/projects/`, `/search/`, `/blog/<post>/`.

#### Gotchas learned
- inertia-django passes only `page` (the full JSON) into the layout context — **no** `meta` / `site` / `nav` vars. So a template that reads `{{ meta.title }}` 500s. Use `<svelte:head>` in the layout component instead.
- There is **no `{% inertia %}` Django tag** — the layout defines `{% block inertia %}` and inertia-django fills it.
- `INERTIA_LAYOUT = "base.html"`, `INERTIA_VERSION = "1.0"`, `INERTIA_SSR_ENABLED = False` in `core/settings/base.py`.
- Page models declare `class X(Page, InertiaMixin)`; the mixin inspects the class at inheritance and injects `serve()` (Inertia). Do **not** switch back to `TemplateResponse` without also restoring `assets/`, `core/middleware.py`, `apps/search/{apps,urls}.py`, `public/fonts/`, and reworking `vite.config.ts` to multi-entry.
