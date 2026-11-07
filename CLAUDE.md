# CLAUDE.md

## Project Overview

A hyper-modern personal blog powered by **Wagtail CMS** covering technology, personal life, and politics. Dark-first aesthetic inspired by Ghost blog, github.blog (mood badges), and MakerKit articles. SPA-like navigation via Inertia.js.

**Tech Stack:** Django + Wagtail 7.3 | Inertia.js (django-inertia server + @inertiajs/svelte client) | Svelte 5 | Vite 7 | Tailwind CSS 4 + shadcn-svelte | lucide-svelte (icons) | Mermaid.js (diagrams) | django-vite 3.1

## Hard Rules

- **NO CDN requests** — never fetch anything from jsDelivr, CDN, or any external URL. All dependencies MUST be installed via npm and bundled through Vite. This includes fonts, scripts, styles, and assets.
- **NO raw CSS in templates** — all styling via Tailwind utility classes. Use `@utility` in `tailwind.css` for reusable patterns.
- **NO CSS-in-templates** — all styling via Tailwind utility classes. Dynamic styles via Svelte `$derived` + `class` bindings.
- **Backend-heavy** — use Python/Django to process everything. Reduce JS payload as much as possible. Server-side rendering for all logic.
- **All deps through npm + Vite** — everything registered via `vite.config.ts` + `{% vite_asset %}`.
- **Full type hints** — type annotations on all functions, methods, and variables. No `from __future__ import annotations` needed (Python 3.14+ has PEP 563 built-in).
- **No em dashes** — use normal dash (-) instead. Never use — or &mdash; in text or templates.
- **Prefer classes over IDs** — use CSS classes for styling and HTMX targeting. Only use IDs when strictly necessary.
- **DRY principle** — reuse Wagtail/framework features instead of building custom endpoints. Use Wagtail API, not custom views.
- **Svelte 5 components** — all frontend UI in Svelte components under `web/src/`. No web components / no Svelte legacy syntax (runes only).
- **StreamField wherever possible** — use Wagtail StreamField for editable content blocks instead of plain RichTextField.
- **Update NEXT_PLANS.md after every step** — after completing any implementation step (code change, migration, template edit, etc.), update NEXT_PLANS.md to mark completed items, log what was done, and note any new findings.
- **Update CLAUDE.md after each iteration** — after completing work, update CLAUDE.md with any new facts about the project (changed conventions, new files, new patterns, removed features) so the documentation stays current.
- **NO jQuery** — never use the jQuery library. All DOM manipulation must use vanilla JS (`querySelector`, `addEventListener`, etc.). Using `$` as a shorthand variable for `querySelector` is fine.
- **Always use `@apply` in Tailwind CSS** — when adding custom styles in `tailwind.css`, always use `@apply` with Tailwind utility classes instead of raw CSS properties.
- **No inline `style` when Tailwind suffices** — avoid inline `style="..."` attributes when the same effect can be achieved with Tailwind utility classes. Inline styles are only acceptable for dynamically computed values (colors from images, widths from JS).


## Project Structure

```
blog/
├── core/
│   ├── settings/
│   │   ├── base.py          # Django/Wagtail settings (inertia, django-vite)
│   │   ├── dev.py           # DEBUG=True, SQLite, debug-toolbar, Vite dev_mode
│   │   └── production.py    # Production overrides
│   ├── templates/           # base.html (Inertia layout) only; 404/500 + components/ removed (search is now an Inertia view, no template)
│   │   └── base.html        # Inertia layout: head, SEO/OG meta, vite_asset, inertia block
│   └── urls.py              # Wagtail pages, admin, sitemap
├── mixins/
│   └── inertia/
│       └── base.py          # InertiaMixin: inspects the page class at inheritance, injects serve()
├── apps/
│   ├── blog/
│   │   ├── models.py        # BlogIndexPage (pagination, tag filter), BlogPage (mood, StreamField, readtime, TOC)
│   │   ├── blocks.py        # StreamField block definitions (AOS + interactive)
│   │   ├── views.py         # author_avatar (Libravatar proxy). blog_page_partial removed (was HTMX)
│   │   └── feeds.py         # BlogRSSFeed
│   ├── home/
│   │   ├── models.py        # HomePage (max_count=1, hero, latest posts, featured projects)
│   │   └── blocks.py        # CTABlock (StructBlock: text + url)
│   ├── projects/
│   │   └── models.py        # ProjectIndexPage, ProjectPage
│   ├── search/
│   │   ├── models.py        # search_posts() - one lean DB query (no search index, no cache)
│   │   └── views.py         # search_view() -> Inertia SearchPage modal
│   ├── tags/
│   │   ├── models.py        # BlogImage (custom Wagtail Image with auto palette)
│   │   └── templatetags/    # site_tags (icons, mood colors), image_colors
│   ├── site_settings/
│   │   └── models.py        # SiteConfigSettings (copyright, license, site name)
│   └── users/
│       ├── models.py        # Custom User (username, email)
│       └── manager.py
├── web/                     # Svelte frontend (Inertia client)
│   └── src/
│       ├── main.ts          # Inertia app bootstrap + page resolver (import.meta.glob)
│       ├── app.css          # Tailwind 4 + shadcn-svelte tokens + fonts + code highlight
│       ├── pages/           # One Svelte component per page type
│       │   ├── Home.svelte / BlogIndex.svelte / BlogPage.svelte
│       │   ├── ProjectIndex.svelte / ProjectPage.svelte
│       │   └── Generic.svelte / NotFound.svelte
│       ├── layouts/
│       │   └── DefaultLayout.svelte  # Navbar + main + Footer wrapper
│       └── lib/
│           ├── Icon.svelte  # lucide-svelte name->component wrapper
│           ├── Emoji.svelte # Twemoji inline-SVG wrapper: eager glob of web/src/vendor/twemoji/svg/*.svg, inlines via @html
│           ├── types.ts     # All prop types (StreamBlock union, Post, Nav, Site, etc.)
│           ├── utils.ts     # cn() helper
│           ├── hooks/
│           │   └── theme.ts # Theme init/toggle (localStorage, dark default)
│           ├── components/
│           │   ├── Navbar.svelte / Footer.svelte / PostCard.svelte
│           │   ├── MoodBadge.svelte / LicenseBadge.svelte / Toc.svelte
│           │   └── ui/      # shadcn-svelte (button, badge, card, tabs, tooltip, alert, separator)
│           └── blocks/      # StreamField block components
│               ├── BlockRenderer.svelte  # Dispatcher by block.type
│               ├── AOS.svelte            # IntersectionObserver animation wrapper
│               └── ... (Paragraph, Heading, Quote, Code, Mermaid, Tabs, Timeline, etc.)
├── vite.config.ts           # Svelte + Tailwind plugins, single entry web/src/main.ts
├── static/                  # Vite build output
├── public/                  # Public assets
├── media/                   # User uploads
└── pyproject.toml           # Python deps
```

## Key Conventions

### Django/Wagtail (heavy backend)
- **Custom user model:** `apps.users.User` (USERNAME_FIELD = "username")
- **Page hierarchy:** Root → HomePage (max_count=1) → BlogIndexPage / ProjectIndexPage
- **All Page models have `editor_panels`** with Content/Promote/Settings tabs (Wagtail 7.x best practice)
- **All Page models have `search_fields`** for Wagtail search index coverage
- **BlogPage:** `mood` field, StreamField body (paragraph/image/code + AOS blocks), tags, readtime (with `clock` icon), Libravatar avatar, reading progress bar, publish date (with `calendar` icon), last updated indicator (with `history` icon, shows when `last_published_at` differs from `date`)
- **AOS blocks have `group`** metadata (Content, Media, Layout, Interactive) - auto-groups in admin
- **Site settings:** `wagtail.contrib.settings` with `SiteConfigSettings`
- **Inertia render:** declare pages as `class ActualPage(Page, InertiaMixin)` (Page first is fine). `InertiaMixin.__init_subclass__` inspects the class at inheritance and injects `serve()`, so Inertia wins over `Page.serve`. `component` is optional and defaults to the class name minus trailing `Page`; set it explicitly when the Svelte filename differs (e.g. `BlogPage`).
- **Auto-dumped props:** `InertiaMixin` introspects the page instance + its view context at runtime. Every concrete model field (and m2m like `tags`) is dumped by type; querysets/paginator pages/tag counts from `get_context()` are dumped too. There are **no per-app serializer files**.
- **StreamField serialization:** each block is auto-dumped as `{ type: <block name>, value: <fields> }`. RichText becomes an HTML string, images become `{url, alt, ...}`, and `StructBlock.get_context()` extras (e.g. Pygments highlighting) are merged. `BlockRenderer.svelte` dispatches on `block.type`; components read `block.value`.
- **Shared chrome:** `InertiaMixin` builds generic meta + nav from the page instance. Apps add more by exporting `shared_props(request, page)` from `<app>.inertia` (e.g. `apps/site_settings/inertia.py`), discovered at runtime. Mood/license **labels** resolve server-side (footer license name, index mood-filter options); mood/license **color classes + labels** resolve **client-side** in `web/src/lib/badges.ts` from just the `mood` / `license_type` key, so the color maps are not shipped in every Inertia payload.
- **Search:** `/search/` is a thin Inertia view (not a Wagtail page). `apps.search.models.search_posts()` runs one lean DB query (`title__icontains | intro__icontains`, no search index, no cache) and returns all live posts; the modal (`SearchPage.svelte`) filters them **client-side** for instant results. Navbar search button + Ctrl/Cmd+K open it. Server-side `?q=` filter also works. Keep the backend lean: preload once, filter in the browser.
- **StreamField blocks:** defined in `apps/blog/blocks.py` (AOS + interactive). Each has a matching Svelte component in `web/src/lib/blocks/`.
- **shadcn-svelte components:** button, badge, card, separator, tabs, tooltip, alert in `web/src/lib/components/ui/`. Built on bits-ui (Radix Svelte) + cva + `cn()`.
- **RichTextField:** all have explicit `feature_names` restriction
- **WAGTAILADMIN_RICH_TEXT_FEATURES:** global feature config set
- **Fonts:** `@fontsource-variable` npm packages (Inter, Plus Jakarta Sans, JetBrains Mono) imported in `web/src/app.css`. Vite bundles the woff2 files as hashed `/static/assets/*` URLs with `unicode-range` subsetting (only the Latin subset downloads on first load). `--font-sans` / `--font-mono` set in `:root`. `Hind Siliguri` is unused (removed). The old `public/fonts/` + `assets/tailwind/fonts.css` trees were removed in the Inertia cleanup.
- **Dot-grid utilities:** `grid-bg`, `dot-grid-light` in `web/src/app.css`.
- **Custom image model:** `tags.BlogImage` via `WAGTAILIMAGES_IMAGE_MODEL = "tags.BlogImage"`. Extends `AbstractImage` with auto palette extraction (modern_colorthief) on save. Palette cached as `palette_json` (JSONField) and `dominant_color_hex` (CharField).
- **Image security:** `WAGTAILIMAGES_MAX_IMAGE_PIXELS = 92_000_000` (~12MP)
- **No `XFrameOptionsMiddleware`** — removed since Wagtail 4.0+ doesn't need it

### Frontend (Inertia + Svelte 5)
- **Inertia.js** — server (inertia-django) serializes props to JSON; client (`@inertiajs/svelte`) drives SPA navigation. First load = HTML with `<script data-page="app">` + `<div id="app">`; subsequent = XHR JSON.
- **Svelte 5 runes** — `$props()`, `$state`, `$derived`, `$effect`, Snippet, `{@render}`. No legacy `export let` / `$:` syntax.
- **Page resolver** — `import.meta.glob('./pages/**/*.svelte', { eager: true })` in `main.ts`. Component name (server) = filename (client) without `.svelte`.
- **Layout** — `DefaultLayout.svelte` receives `children` Snippet + shared props. Navbar/footer persist across page transitions.
- **django-vite** — `{% vite_asset 'web/src/main.ts' %}` in `base.html` loads the single bundle.
- **Tailwind CSS 4** + shadcn-svelte tokens — dark-first (`:root` light, `.dark` dark).
- **AOS animations** — `AOS.svelte` wrapper uses IntersectionObserver (no AOS library).
- **Theme** — `web/src/lib/hooks/theme.ts` (localStorage, dark default). Inline script in `base.html` sets `.dark` class before CSS loads to prevent flash.
- **lucide-svelte** — icons via `Icon.svelte` wrapper. Server sends icon name strings; client maps to lucide-svelte components.
- **Twemoji (vendor inline SVG)** — `web/src/vendor/twemoji/svg/` holds all 3,689 Twemoji graphics (CC-BY 4.0). `Emoji.svelte` eagerly `import.meta.glob`s them as raw strings (`{ eager: true, query: '?raw', import: 'default' }`), so **all 3,689 are bundled into the single large `main.js`** (no per-emoji chunks or network requests) and inlined via `@html`, so they can be CSS-styled (width/height, `filter`, `clip-path`). `vite.config.ts` sets `publicDir: false` so the SVGs are not also copied as static files. Accepts `<Emoji value="✨" class="h-5 w-5" />` (emoji char) or `<Emoji codepoint="1f1e8-1f1f3" />`. Uses the `twemoji` npm package **only** for `twemoji.convert.toCodePoint()` (char -> hex; no network call). **Gotcha:** twemoji v14 ESM is `export default` only - `import * as tw` leaves `tw.convert` undefined at runtime, so default-import it (`import twemoji from 'twemoji'`). Note the SVGs carry hardcoded `fill` colors, so `text-*`/`currentColor` won't recolor them - use `filter`/`clip-path`.

### Design System
- **Ghost blog:** centered article card, generous whitespace, clean typography
- **Genshin Impact / anime aesthetic:** constellation rails (connected dots + stars), ornamental dividers (gem + prism + sparkles), crown ornaments, crystal frames, dotted borders (`border-dotted`), celestial markers (orbit, compass, infinity)
- **github.blog:** colored mood badges (purple=tech, sky=personal, red=politics, etc.)
- **Sidebar TOC:** Takumi docs style — right-column sticky sidebar. Scroll-spy: threshold-based (last heading whose top <= 100px is active), parent H2 propagation (H3 active also highlights preceding H2). `data-active` attribute (`"true"`/`"false"`) styled via `data-[active=true]:text-primary`. Slug animation: sliding dot + SVG track via stroke-dasharray/dashoffset (follows exact rail curve), track covers all visible headings. Rail path: quadratic curves (H2 straight vertical at x=8.5, H3 curves out to x=16.5 and back). Clean links, H2/H3 indentation, curved SVG rails for H3 items.
- **Blog index:** MakerKit alternating rows, ornamental decorative separators, AOS fade-up on scroll, background dot grid, constellation rails (left/right) with stars/orbits/gems
- **Blog page:** CSS Grid layout (`grid-cols-[auto_auto_1fr_auto]` for left rail + TOC + content + right rail), dotted borders on all frames, ornamental corner sparkles, crown end marker
- **Feminine icon set:** `sparkles` (decorative dots), `infinity` (ornamental curves), `gem` (crystalline), `star` (celestial), `compass` (navigation), `cross` (ornamental), `prism` (crystalline), `orbit` (planetary), `crown` (regal)
- **Color palette:** deep dark (#080809), purple primary, orange accent
- **Typography:** Plus Jakarta Sans (headings/body), Inter (body), Hind Siliguri (Bengali), JetBrains Mono (code)

### Base Template (Inertia Layout)
- **`base.html`** is a **minimal** Inertia layout: `<html data-theme>` + head (charset, viewport, `{% vite_asset 'web/src/main.ts' %}`) + body (`{% block inertia %}{% endblock %}`). inertia-django extends it and injects `<script data-page="app">…</script><div id="app">` into the block. `<title>` + SEO/OG/Twitter meta live in **`<svelte:head>` in `DefaultLayout.svelte`** (reads the `meta` prop) - Svelte-idiomatic and stays correct across SPA nav. The layout passes only `page` (full JSON) to the template; there are no `meta`/`site`/`nav` context vars.
- **Theme init** — inline script in `<head>` sets `.dark` class on `<html>` before CSS loads. Prevents flash of unthemed content.
- **Nav URLs** resolved server-side by `_nav_props()` from the site root's live children (keyed by slug) and passed as `nav` to all pages.
- **Footer** sticks to bottom via flexbox in `DefaultLayout.svelte`.
- **TOC** — `Toc.svelte` scroll-spy: threshold-based (last heading whose `getBoundingClientRect().top <= 130` is active), parent H2 propagation (H3 active also highlights preceding H2). Sticky sidebar via `sticky top-24` in a grid layout.
- **Reading progress bar** — `BlogPage.svelte` fixed at top, updates on scroll via `$state`.
- **Icons** — `Icon.svelte` wrapper maps server-sent name strings to lucide-svelte components.
- **Mermaid.js** — `Mermaid.svelte` lazy-renders on scroll intersect via IntersectionObserver.
- **Code copy** — `Code.svelte` copy button reads `block.value.code` (auto-dumped). Feedback via `$state`.
- **Image colors** — `modern_colorthief` palette extraction on save; `dominant_color_hex` is included in the dumped `feed_image` / `image` object.
- **Inertia progress bar** — `progress: { color: '#8b5cf6', showAfter: '0ms' }` in `createInertiaApp` config. Shows during SPA navigation.

### Svelte 5 idioms (per official LLM docs)
- **Window/document listeners** — use `on(window, ...)` from `svelte/events` inside `$effect`; the effect's return value detaches them. Do NOT use `onMount` + manual `addEventListener`/`removeEventListener` for global listeners. (Toc, BlogPage, Navbar follow this.)
- **No effects to sync state** — `$effect` is an escape hatch. Never write state in an effect to mirror DOM/props; derive with `$derived` or re-read inside the handler. (Navbar `isDark` reads the `<html>` class once at init and re-reads inside `toggle()`, no effect.)
- **Keyed each blocks** — every `{#each}` has a unique key by a stable field (`url`, `label`, `name`, `value`, `title`, ...), never the index. Keep the `i` index only where used (e.g. AOS `delay={i * N}`).
- **Declaration tags over legacy** — use `{const x = ...}` / `{let x = ...}` (Svelte 5.56+), not `{@const}`.
- **Snippets over slots** — `{#snippet}` / `{@render}` for component composition.
- **One-time mount work** — `onMount` is acceptable only for genuinely once-per-mount side effects (e.g. Mermaid's lazy `import("mermaid")` + IntersectionObserver render).

## What to Do When...

### Adding a new page type
1. Model in `apps/*/models.py` as `class NewPage(wagtail.models.Page, InertiaMixin)`, type-hint everything
2. Optionally set `component = "NewPage"` (defaults to the class name minus trailing `Page`)
3. Define `parent_page_types` (class refs preferred), `subpage_types`, `search_fields`
4. Define `content_panels` + `editor_panels` with Content/Promote/Settings ObjectLists
5. That's it for the backend — model fields + `get_context()` are auto-dumped. No serializer file.
6. Create `web/src/pages/NewPage.svelte` consuming the field names directly (e.g. `title`, `body`)
7. Add the prop interface to `web/src/lib/types.ts`

### Adding a new StreamField block
1. Create the block class in `apps/blog/blocks.py` (or app-specific blocks file)
2. Set `group` in Meta (Content, Media, Layout, or Interactive)
3. No serializer needed — blocks are auto-dumped as `{ type, value }`
4. Create `web/src/lib/blocks/NewBlock.svelte` reading `block.value.<field>`
5. Add a case in `BlockRenderer.svelte` for the new `block.type`
6. Add the block interface to `web/src/lib/types.ts` and the `StreamBlock` union
7. Register in the model's StreamField choices

### Adding a new Svelte component (UI)
1. Create in `web/src/lib/components/` (or `web/src/lib/components/ui/` for shadcn-style)
2. Use `$props()` with destructuring, `$state` for reactive values
3. Use `cn()` for class merging, Tailwind utility classes only
4. Icons via `<Icon name="..." class="..." />`

### Styling
- **Tailwind classes only** — no `<style>` blocks in Svelte components (use `class` directives)
- Reusable patterns → `@utility` in `web/src/app.css`
- shadcn-svelte tokens: `bg-background`, `text-primary`, `border-border`, `bg-card`, `text-muted-foreground`
- Article prose: `prose prose-invert` with inline Tailwind overrides
- **All class names must be literal strings** in Svelte templates so Tailwind scanner picks them up

### Running the project
- Backend: `uv run python manage.py runserver`
- Frontend: `npm run dev` (Vite HMR) or `npm run build`
- DB: SQLite (dev), PostgreSQL (prod)
