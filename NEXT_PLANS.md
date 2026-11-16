# Next Plans

## Completed
- [x] **Emoji-in-text rendering fixed (2026-11-11)** — two bugs blocked Twemoji SVGs from rendering in rich-text blocks:
  - **Key mismatch:** `Emoji.tsx` built the `TWEMOJI` map with keys like `2728.svg` (the `./` prefix was stripped but the `.svg` suffix was not), while the codepoint lookup key is bare `2728`. Every lookup returned `undefined`, so all emoji fell back to `?`. Fixed by stripping the `.svg` suffix in addition to the `./` prefix: `key.replace(/^\.\//, '').replace(/\.svg$/, '')`.
  - **SVGR `default` export shape:** webpack's `__webpack_require__.d` wraps the SVGR component's `default` export as a getter that evaluates to a **React element** (not a component function) on access. `Emoji.tsx` now detects both shapes with `isValidElement(Comp)` and renders the element directly, or calls it as a component. (Also fixed a lowercase `<mod />` JSX bug: esbuild compiles lowercase tags as HTML elements, not variables - renamed to `Comp`.)
  - **Verified:** `http://localhost:8000/blog/kitchen-sink/` renders all 17 block types with 31 Twemoji SVGs inline, 0 page console errors.
- [x] **TOC stickiness fixed (2026-11-11)** — the grid used `items-start` (`align-items: flex-start`), which prevented the `aside` from stretching to the full grid row height. The `aside` was only 140px tall (its content), so the inner `sticky top-24` div had no room to travel. Fixed by changing the grid to `items-stretch` so the `aside` stretches to match the article column height, giving the sticky element its full range. Also removed the redundant `self-start` from the `aside`.
- [x] **Webpack build made to actually work (2026-11-10)** — the prior "completed" webpack entry left a build that compiled green but crashed at runtime; three runtime bugs fixed and verified in-browser:
  - `import.meta.webpackContext` (webpack's `import.meta.glob` equivalent) is **stripped by esbuild** to `{}.webpackContext(...)` → `TypeError: webpackContext is not a function` on every page load. Replaced with `require.context(...)` in both `main.ts` (pages) and `Emoji.tsx` (Twemoji SVGs, `mode: 'lazy'` → each SVG its own on-demand chunk). **Gotcha:** even `mode: 'eager'` `require.context` returns a **Promise**, so the Inertia `resolve` must `await` the call (`const mod = await pageContext(key)`).
  - `svgr-loader` was hardcoding Babel 7 plugins (`@babel/plugin-transform-react-constant-elements`, `@babel/plugin-proposal-object-rest-spread`) that root `@babel/core@8` + `@babel/preset-react@8` no longer ship → build failure. Switched to `@svgr/webpack` (self-contained Babel 7 stack); uninstalled `svgr-loader`, `svgo-loader`, the `@babel/*` chain, and `mini-css-extract-plugin`. **Gotcha:** do NOT add an `issuer: /\.(tsx|ts)$/` filter to the `@svgr/webpack` rule - it blocks `require.context` (webpack contexts have no JS issuer) and breaks all 3,689 Twemoji SVGs.
  - Removed the blocking `{% render_bundle 'main' 'css' %}` tag from `base.html`: with `style-loader` (no CSS file emitted), the `css` tag blocks the HTTP response forever waiting for a CSS asset that never exists (this was the "page stuck" symptom). Styles now arrive via the JS bundle at runtime; only `{% render_bundle 'main' 'js' %}` remains.
  - Dropped the custom `optimization.splitChunks` block per request (webpack defaults); CSS via `style-loader` in both dev and prod.
  - **Dev/prod split:** dev = `webpack serve` on `http://localhost:3000` (CORS-allowed for `:8000`); prod = `npm run build` → `static/assets/*` + `webpack-stats.json`, served by WhiteNoise. The `render_bundle` tag reads the hash from stats, so both modes render identical markup.
  - **Emoji-in-text:** new `web/src/lib/blocks/EmojiText.tsx` parses a rich-text HTML string into React nodes and replaces every emoji char with `<Emoji>` (Twemoji SVG). Wired into the text blocks: Paragraph, Quote, Highlight, Callout, Steps, Timeline, CardGrid, Image caption, TabsBlock (replaced `dangerouslySetInnerHTML`).
  - **Verified end-to-end:** `npm run build` compiles clean; served page hash == stats hash == on-disk file (200); `/blog/django-tips/` loads with **0 console errors**; dark theme + shadcn tokens + badges render correctly (Playwright screenshot); a Twemoji lazy chunk (`10967`) is fetchable and contains a valid React SVG component. (No post currently contains an emoji char, so the `<Emoji>` render path is wired but not yet exercised by real content.)
- [x] Site-settings Inertia integration (final): app-agnostic layer in `mixins/inertia/site_settings.py` (pure `SiteSettingMixin` marker, generic `resolve_label(key, choices, default)`, generic `serialize_site_settings(settings, fields=...)` field-dumper). **No knowledge of licenses or any specific field.** Model owns serialization: `SiteConfigSettings.to_site_props()` returns the exact `Site` shape; `license_label()` lives in `apps/site_settings/models.py` next to `LicenseOptions`. `SiteConfigSettings` inherits both `BaseSiteSetting` and `SiteSettingMixin`. `apps/site_settings/inertia.py` is the thin `shared_props` provider (calls `to_site_props()`). Old `apps/site_settings/serializers.py` removed.
- [x] Fix `mixins/blocks/aos.py` — removed dead `from frozendict import froenset` typo import and changed `AOS_EFFECTS` from `frozenset(...)` to a plain `list` (matches the `list[tuple[str, str]]` annotation; ChoiceBlock choices stay valid). Kept location as-is (already imported as `mixins.blocks.aos`).
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

## Svelte → React 19 migration (2026-11-07)

Full pivot from Svelte 5 + `@inertiajs/svelte` to React 19 + `@inertiajs/react`. All components ported; backend unchanged (InertiaMixin, component names, StreamField dump).

#### Dependencies
- [x] Removed: `svelte`, `@sveltejs/vite-plugin-svelte`, `@inertiajs/svelte`, `bits-ui`, `lucide-svelte`, `svelte-emoji-picker`
- [x] Added: `react` 19.3.1, `react-dom` 19.3.1, `@inertiajs/react`, `lucide-react`, `@vitejs/plugin-react`, `@types/react`, `@types/react-dom`, `vite-plugin-svgr` (SVGR for `?react` SVG imports)

#### Vite config
- [x] `vite.config.ts` — `svgr()` + `react()` + `tailwindcss()` plugins; single entry `web/src/main.tsx`; `publicDir: false`

#### Components
- [x] `web/src/main.tsx` — `createInertiaApp` with `resolve` returning `{ default, layout }`; page resolver `import.meta.glob('./pages/**/*.tsx', { eager: true })`; `initTheme()` before first paint; progress bar
- [x] `web/src/layouts/DefaultLayout.tsx` — `<Navbar/><main><children></main><Footer/>`; receives `nav`, `site`, `children` (ReactNode); no more `<svelte:head>` (SEO moved server-side)
- [x] All 8 pages: Home, BlogIndex, BlogPage, ProjectIndex, ProjectPage, SearchPage, Generic, NotFound
- [x] All 18 block components ported (AOS, BlockRenderer, Paragraph, Heading, Quote, Highlight, Separator, Image, Mermaid, Code, Callout, StatsGrid, CardGrid, TabsBlock, Timeline, Steps, Alert, TooltipBlock)
- [x] shadcn/ui-style React components: button, badge, card, separator, tabs, tooltip, alert
- [x] `Icon.tsx` — `lucide-react` wrapper with name → component map (all names verified)
- [x] `Emoji.tsx` — SVGR-based lazy `import.meta.glob('../vendor/twemoji/svg/*.svg', { query: '?react', import: 'default' })`; each SVG becomes a real React function component (not a raw string); accepts `value` (emoji char) or `codepoint`
- [x] `MoodBadge.tsx`, `LicenseBadge.tsx`, `PostCard.tsx`, `Toc.tsx`, `Navbar.tsx`, `Footer.tsx`

#### Server-side SEO (Django)
- [x] `mixins/inertia/base.py` — `_seo_tags(props)` builds `<title>`, `<meta name=description>`, RSS link, `og:*`, `twitter:*` tags from `props["meta"]`; passed via `template_data={"seo_tags": tags}` to both `inertia_render` calls
- [x] `core/templates/base.html` — `{% block inertia_head %}{% for tag in seo_tags %}{{ tag|safe }}{% endfor %}{% endblock inertia_head %}` renders server-side SEO tags in `<head>` before the Inertia app hydrates (crawlers see a complete page without JS)

#### Build / type-check
- [x] `npx tsc --noEmit` — clean (0 errors)
- [x] `npm run build` — succeeds; 3,786 JS chunks (3,689 Twemoji components + app chunks); main ~905 kB / gzip 200 kB

#### Remaining
- [ ] Runtime browser smoke test (Playwright): all routes, SPA nav, theme toggle, Ctrl/Cmd+K, emoji renders, block rendering
- [ ] CLAUDE.md update: Svelte → React, `<svelte:head>` → server-side `inertia_head`, `$props` → React props, `$effect` → `useEffect`, etc.

## DaisyUI 1:1 design system port (2026-11-07)

Goal: make the `inertia` branch look **1:1** with `master` (Django templates + Svelte + DaisyUI). Chose DaisyUI (what master natively uses) over shadcn+base-ui for exact fidelity.

#### Design system (web/src/app.css)
- [x] Replaced the shadcn-token design system with DaisyUI. `@import "daisyui/daisyui.css"` (the static CSS entry; **not** `@import "daisyui"` which resolves to the JS plugin and breaks the Tailwind v4.3 build with `Invalid declaration: pluginOptionsHandler`).
- [x] `@theme inline` bridge registering DaisyUI's `--color-*` tokens as Tailwind utilities (base-100/200/300, base-content, primary/-content, secondary/-content, accent/-content, neutral/-content, info/success/warning/error +/-content). Without this, `@apply text-base-content/80` etc. fail at build time.
- [x] Two custom themes as plain `:root`/`[data-theme]` selectors (NOT `@plugin "daisyui/theme"`): `tanstack-dark` (default, on `:root`, `color-scheme: dark`, base-100 `rgb(8,8,9)`, primary `oklch(62% 0.22 295)`) and `tanstack-light` (on `[data-theme="tanstack-light"]`).
- [x] Ported master utilities: `grid-bg`, `dot-grid`/`-light`/`-subtle` (SVG-dot radial gradients), `bg-glow-top/center/bottom/accent/dual` (radial ellipses via `color-mix(in oklab, ...)`), `bg-edge-fade`, `border-glow-bottom`. Replaced invalid `oklch(var(--p))` with `color-mix(in oklab, var(--color-primary) N%, transparent)`.
- [x] Pygments `.code-highlight` (lovelace) re-tokened to DaisyUI (base-content, primary, success, error, accent, info, warning).

#### Theme system
- [x] Switched from `.dark` class to `data-theme="tanstack-dark"`/`"tanstack-light"` on `<html>`. `theme.ts` (getStoredTheme/setTheme/toggleTheme/isDark/initTheme) updated; `base.html` already sets `data-theme`.

#### Components (all DaisyUI tokens, shadcn `ui/` dir removed)
- [x] All 8 pages (Home, BlogIndex, BlogPage, ProjectIndex, ProjectPage, SearchPage, Generic, NotFound) + Navbar, Footer, DefaultLayout, Toc, PostCard rewritten to master's look (dotwork constellation, glow/grids, mockup-browser frames, alternating rows, mood badges, corner accents, crown end markers).
- [x] All 18 block components re-tokened to DaisyUI: Paragraph, Heading, Quote, Code, Image, Highlight, Separator, Callout, StatsGrid, CardGrid, TabsBlock (native `tabs tabs-box`), Timeline, Steps, Alert, TooltipBlock (native `title` attr), Mermaid, AOS, BlockRenderer.
- [x] Dropped the shadcn `web/src/lib/components/ui/` directory (button/badge/card/separator/tabs/tooltip/alert) entirely - no external refs remain.

#### Build / verification
- [x] `npx tsc --noEmit` - clean (0 errors).
- [x] `npm run build` - succeeds; single CSS ~1.56 MB, JS main ~905 kB / gzip 200 kB.
- [x] Browser smoke test: `/`, `/blog/`, `/projects/`, `/blog/my-setup/` all 200. Theme `tanstack-dark` active, primary/base-content tokens resolve, Plus Jakarta Sans loaded. Only console error is a harmless `favicon.ico` 404.

#### Open
- [ ] Consider CC-BY 4.0 Twemoji attribution (still pending from the Twemoji task).

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

## Layout tweaks (2026-11-07)
- [x] Replaced deprecated Tailwind v4 `bg-gradient-to-*` with canonical `bg-linear-to-*` in `Home.tsx`, `NotFound.tsx`, `Separator.tsx` (fixes tailwindcss-intellisense `suggestCanonicalClasses` warnings).
- [x] `npx tsc --noEmit` clean (0 errors) after edits.
- [ ] BlogPage full-width stretch experiment: tried removing `max-w-4xl`/`max-w-7xl` caps but user said "NOPE, NOT RIGHT" - reverted all changes back to original centered layout (`git diff` clean). Open: user says "height should be full content" - unclear what's off, needs clarification before trying again.
- [x] **Critical layout bug fixed:** Inertia 3 `layout` option is a callback `(component, page) => Component`, NOT a component ref, and is NOT read from the resolver's `{ default, layout }` return (that key is discarded). `main.tsx` previously had `layout: DefaultLayout` inside `resolve` (ignored) → navbar, footer, and page-shell were never rendered on ANY page, and the dark body showed as a "black band" below content. Fixed: resolver returns `page.default`; `layout: () => DefaultLayout` (callback) at top level. Verified: navbar + footer + `.page-shell` all render; no console errors.
- [x] **Black band below article/index fixed:** `main` in `DefaultLayout.tsx` was a plain block (no flex), so page roots with natural height left a dark gap between content bottom and footer top. Fixed: `main` → `flex-1 flex flex-col`; `BlogPage` root div → added `flex-1` (stretches to fill main); `BlogIndex` blog-list div → added `flex-1 flex flex-col` (stretches to fill remaining space after header). Verified: no gap on `/blog/my-setup/`, `/blog/`, or `/`.

## DaisyUI → shadcn + base-ui migration (2026-11-07)

Full retheme: replaced all DaisyUI component classes and tokens with shadcn CSS variables + base-ui as the component library. Dark mode now uses the `.dark` class on `<html>` (not `data-theme`).

#### Dependencies
- [x] Removed: `daisyui` (no longer needed)
- [x] Added: `@base-ui/react` 1.9.0 (component primitives), `shadcn` 4.23.0 (CLI for token setup), `cn` 0.5.2 (kept local `$lib/utils` cn as canonical)
- [x] `components.json` created at repo root (style "base-nova", baseColor "neutral", aliases `@/components` / `@/lib/utils` / `@/components/ui`, iconLibrary "lucide")

#### Design system (web/src/app.css)
- [x] `@import "shadcn/tailwind.css"` for base utilities (scroll-fade, shimmer, data-open/closed variants, no-scrollbar, accordion keyframes)
- [x] `@import "tw-animate-css"` for animation utilities
- [x] `@theme inline` block bridges shadcn CSS variables into Tailwind utilities: `--color-background: var(--background)`, `--color-foreground: var(--foreground)`, `--color-card: var(--card)`, `--color-primary: var(--primary)`, `--color-muted: var(--muted)`, `--color-border: var(--border)`, `--color-ring: var(--ring)`, `--color-input: var(--input)`, `--color-destructive: var(--destructive)`, `--color-accent: var(--accent)`, `--color-secondary: var(--secondary)`, `--color-popover: var(--popover)`, radius scale, font families
- [x] `@custom-variant dark (&:is(.dark *))` for dark mode variant
- [x] `:root` (light) and `.dark` (dark) token definitions with oklch colors
- [x] Kept: `@layer base` (body bg-background text-foreground), custom utilities (`grid-bg`, `.dot-grid*`, `.bg-glow-*`, `.bg-edge-fade`, `.border-glow-bottom`, `.mask-tb`, `#nprogress-bar`), Pygments `.code-highlight` (retokened: base-content→foreground, base-200→muted, success→secondary, error→destructive, accent→accent, info→primary, warning→destructive, base-300→border)

#### Theme system
- [x] `web/src/lib/hooks/theme.ts` rewritten: now toggles `.dark` class on `<html>` (was `data-theme`). `getStoredTheme()`, `setTheme()`, `toggleTheme()`, `isDark()`, `initTheme()` all use `classList.contains("dark")`.
- [x] `core/templates/base.html` — `<html lang="en" class="dark">` (was `data-theme="tanstack-dark"`)

#### Components (all migrated to shadcn tokens)
- [x] `Navbar.tsx` — navbar/navbar-start/center/end → flex; `btn btn-ghost` → `flex h-9 w-9 items-center justify-center rounded-lg hover:bg-muted`; `kbd` → `rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]`; mobile menu → `w-56 rounded-xl border border-border bg-card p-2`
- [x] `Footer.tsx` — `footer bg-base-200/50 border-base-300/50` → `w-full border-t border-border/50 bg-card/50`; `link link-hover` → `cursor-pointer`
- [x] `PostCard.tsx` — `card bg-base-200/40` → `h-full rounded-2xl border border-border bg-card/60 p-6`; `card-body` → `mt-4 flex flex-col flex-1`; tag pills → `rounded-full border border-border bg-muted`
- [x] `Toc.tsx` — `text-base-content` → `text-foreground`, `stroke-base-content` → `stroke-foreground`
- [x] `MoodBadge.tsx` / `LicenseBadge.tsx` — unchanged (use `badges.ts` color maps with raw Tailwind palette classes, not DaisyUI tokens)
- [x] All 18 block components retokened (text-base-content→text-foreground, border-base-300→border-border, bg-base-200→bg-card, bg-base-300→bg-muted, to-base-content→to-foreground, via-base-content→via-foreground). CardGrid/StatsGrid `card`/`card-body`/`card-title` → inlined `rounded-2xl border border-border bg-card/40 p-6` + `flex flex-col`. TabsBlock `tabs tabs-box` → segmented buttons. Alert/Callout `alert alert-info` → `rounded-2xl border bg-card/50`
- [x] All 8 pages retokened (Home, BlogIndex, BlogPage, ProjectIndex, ProjectPage, SearchPage, Generic, NotFound)
- [x] `DefaultLayout.tsx` — `bg-base-100 text-base-content` → `bg-background text-foreground`

#### Build / verification
- [x] `npx tsc --noEmit` — clean (0 errors)
- [x] `npx vite build` — succeeds; built CSS has shadcn tokens and zero daisyui/tanstack references
- [x] Browser smoke test: `/`, `/blog/`, `/blog/my-setup/` all 200. Dark mode (`.dark` class) and light mode (`.dark` removed) both render correctly with shadcn tokens.
- [x] Black band issue confirmed resolved (footer sticks to bottom via flexbox, no gap)

#### Open
- [ ] Consider removing `daisyui` from `web/package.json` dependencies (confirmed unused after migration)
- [ ] Consider CC-BY 4.0 Twemoji attribution (still pending from the Twemoji task)

## Vercel-style editorial redesign (2026-11-07)

Redesigned the blog index and article page to a clean, editorial, Vercel-inspired aesthetic. Removed the ornamental "Genshin/anime" decoration (constellation rails, dotwork, crown markers, dotted borders) in favor of clean typography, subtle borders, and a content-first layout.

#### Research
- [x] Studied `vercel.com/blog` (index) and `vercel.com/blog/introducing-vercel-schedules` (article). Index: 3-column post card grid, filter pills, date+category+title+description+author per card, minimal chrome. Article: breadcrumb, large left-aligned title (weight ~450), author + names, date/read-time on the right, clean body, content-first.

#### BlogIndex (`web/src/pages/BlogIndex.tsx`) — rewritten
- [x] 3-column responsive card grid (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3`), each card: mood badge + date (top row), title, intro (line-clamp-3), read time + tags (bottom). Subtle `rounded-2xl border border-border bg-card/40` with hover lift.
- [x] Header: large title + optional intro + **filter pills** row (All, mood pills with color dot, tag pills with count). Pills are buttons that call `filter()` via Inertia `router.get` (existing query-param behavior preserved).
- [x] Removed: sidebar (About/Browse-by-Mood/Tags/Stats), constellation rails, dotwork corners, crown end-marker, decorative separators.
- [x] Empty state + "Load more" button + post count retained.

#### BlogPage (`web/src/pages/BlogPage.tsx`) — rewritten
- [x] Breadcrumb (Blog / MoodBadge), large left-aligned title (`text-balance`), meta row: author avatar+name (left) and date/updated/read-time (right) in a `justify-between` row.
- [x] Cover image (`aspect-video rounded-2xl border`), intro as a lead paragraph, thin gradient divider, prose body (re-tuned `PROSE`: `prose-lg`, `prose-h2:scroll-mt-24` for anchor offset under the fixed progress bar).
- [x] Tags as pills at the bottom, license badge + "Back to blog" end row.
- [x] TOC retained as a right sticky sidebar (`lg:grid-cols-[minmax(0,1fr)_220px]`, `sticky top-24`); hidden when <2 headings.
- [x] Removed: left/right constellation rails, ornamental dividers, dotted frames, crown end marker, decorative sparkles.

#### Build / verification
- [x] `npx tsc --noEmit` clean (0 errors).
- [x] Browser: `/blog/` index grid + filter pills render; `/blog/my-setup/` article renders (breadcrumb, title, meta row, intro, license/back row).

#### Notes
- The ornamental aesthetic remains in `Home.tsx`, `ProjectIndex.tsx`, `ProjectPage.tsx` and the block components; only the two blog pages were converted to the editorial style. Revisit those for consistency if desired.

## MakerKit-style contrast pass (2026-11-07)

User praised the MakerKit blog's color contrast ("superb") and asked to match it. Studied `makerkit.dev/blog/tutorials/drizzle-vs-prisma` to extract its contrast hierarchy, then raised the floor on our dimmest text tiers.

#### Research
- [x] MakerKit uses a clean 3-tier opacity hierarchy (no hue shifts): H1/H2/strong at pure white (`#fff`), body at ~75% white (`oklab(0.985 0 0 / 0.75)`), meta/tags at ~45-60%. The "superb" contrast comes from a high floor - the dimmest text is still clearly legible, and headings hit full white.

#### Changes
- [x] `app.css`: dark `--muted-foreground` raised `oklch(70%)` → `oklch(75%)` (secondary text floor lifted).
- [x] `BlogIndex.tsx`: card intro `/50` → `/70`; card tags `/30` → `/50`; card date + read-time `/40` → `/55`; tag-pill count `opacity-50` → `text-foreground/50`.
- [x] `BlogPage.tsx`: body prose `/80` → `/85`; list items `/80` → `/85`, markers `/40` → `/50`; blockquote `/70` → `/80`; table body `/80` → `/85`; intro lead `/70` → `/80`; breadcrumb `/40` → `/55`; author sub `/40` → `/60`; date/read-time row `/50` → `/65`; "updated" span `/40` → `/55`; "Licensed Under" label `/40` → `/55`; tag pills `/60` → `/75`; "Back to blog" `/50` → `/70`.

#### Build / verification
- [x] `npx tsc --noEmit` clean (0 errors).
- [x] Browser: `/blog/` index and `/blog/django-tips/` article both verified - text hierarchy is now crisper, meta/tags clearly legible, headings at full white.

## Full audit + fixes (2026-11-16)

See `improvement.md` for the complete report. Summary:

- [x] **Emoji sizing** - wrapper was `inline`, so `h-[1.2em] w-[1.2em]` was ignored and SVGs rendered at 768x768. Now `inline-block`, verified 19x19.
- [x] **Rich text tags** - `EmojiText.tsx` flattened every element to `<span>` (loss of `<strong>`, `<em>`, `<code>`, links, lists, headings). Rewrote with an allowlisted `createElement` walker.
- [x] **Timeline/Steps** - timestamps overflowed the fixed `size-8` badge; `AOS` put a `<div>` inside `<ol>`. Timestamp is now a label above the title, dot on the rail, AOS inside `<li>`.
- [x] **TOC** - replaced the flickering multi-active IntersectionObserver with a stable reading-line active state, sliding indicator bar, smooth anchor scroll, and a TanStack-style mobile `<details>` TOC (`TocMobile.tsx`).
- [x] **Contrast** - added `prose-invert` (the typography default gray-700 was leaking into Tabs/tooltips/project descriptions), raised code-token and footer/license colors, darkened `--primary-foreground` in dark mode. Canvas WCAG audit: 0 failures on `/`, `/blog/`, `/blog/kitchen-sink/`, `/projects/blog-engine/`, `/search/`.
- [x] **RSS** - `/feed/` and `/rss/` were 500s: `self.request` does not exist on `Feed`, and `item_pubdate` returned a `date`. Both fixed, now 200.
- [x] **Image palette recursion** - `BlogImage.save()` -> `_extract_palette()` -> `save(update_fields=...)` recursed forever. Guarded on `update_fields`; verified with a real upload.
- [x] **Migration instability** - `CODE_LANGUAGES` was a `frozenset` (randomized string order), so every `makemigrations` produced a new `AlterField`. Now an ordered list; `makemigrations --check` is clean.
- [x] **Test discovery** - added the missing `apps/__init__.py`; fixed the stale `home.models` import and removed-template assertion. `manage.py test` now runs 3/3 tests.
- [x] **Dev/prod assets** - dev now points `render_bundle` at the webpack dev server (`http://localhost:3000/static/`, absolute stats publicPath, explicit HMR websocket); prod keeps `/static/` for WhiteNoise. Docker now copies `webpack-stats.json` from the frontend builder into the final image.
- [x] `tsc`, `ruff`, `manage.py check`, migrations check, and `npm run build` all pass.

Remaining priorities (details in `improvement.md`): Docker Python 3.14 vs `requires-python >=3.15`; `COPY --chown=app:app` with no `app` user; production `collectstatic` needing AWS env at build; hardcoded `SECRET_KEY` / ignored `DJANGO_SECRET_KEY`; `ALLOWED_HOSTS="*"`; 10.48 MB main bundle from eager Twemoji + wildcard Lucide imports.
