# CLAUDE.md

## Project Overview

A hyper-modern personal blog powered by **Wagtail CMS** covering technology, personal life, and politics. Dark-first aesthetic inspired by Ghost blog, github.blog (mood badges), and MakerKit articles. SPA-like navigation via Inertia.js.

**Tech Stack:** Django + Wagtail 7.3 | Inertia.js (django-inertia server + @inertiajs/react client) | React 19 | webpack 5 (ESM `webpack.config.ts`) | Tailwind CSS 4 (`@tailwindcss/webpack`) + shadcn CSS variables (design system, `.dark` class for dark mode) + base-ui (@base-ui/react) | lucide-react (icons) | Mermaid.js (diagrams) | django-webpack-loader (webpack-bundle-tracker stats) | @svgr/webpack (SVG→React) | style-loader (runtime CSS injection, no extracted CSS file) | esbuild-loader (TS/TSX→JS) | WhiteNoise (prod static serving)

## Hard Rules

- **NO CDN requests** — never fetch anything from jsDelivr, CDN, or any external URL. All dependencies MUST be installed via npm and bundled through webpack. This includes fonts, scripts, styles, and assets.
- **NO raw CSS in templates** — all styling via Tailwind utility classes. Use `@utility` in `tailwind.css` for reusable patterns.
- **NO CSS-in-templates** — all styling via Tailwind utility classes. Dynamic styles via `useMemo`/computed expressions + `className`.
- **Backend-heavy** — use Python/Django to process everything. Reduce JS payload as much as possible. Server-side rendering for all logic.
- **All deps through npm + webpack** — everything bundled via `webpack.config.ts` + `{% render_bundle 'main' %}` (django-webpack-loader).
- **Full type hints** — type annotations on all functions, methods, and variables. No `from __future__ import annotations` needed (Python 3.14+ has PEP 563 built-in).
- **No em dashes** — use normal dash (-) instead. Never use — or &mdash; in text or templates.
- **Prefer classes over IDs** — use CSS classes for styling. Only use IDs when strictly necessary.
- **DRY principle** — reuse Wagtail/framework features instead of building custom endpoints. Use Wagtail API, not custom views.
- **React 19 components** — all frontend UI in React components under `web/src/`. TypeScript, functional components, hooks.
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
│   │   ├── base.py          # Django/Wagtail settings (inertia, django-webpack-loader)
│   │   ├── dev.py           # DEBUG=True, SQLite, debug-toolbar, WEBPACK_LOADER dev stats
│   │   └── production.py    # Production overrides
│   ├── templates/           # base.html (Inertia layout) only; 404/500 + components/ removed (search is now an Inertia view, no template)
│   │   └── base.html        # Inertia layout: head, server-side SEO tags (inertia_head block), render_bundle, inertia block
│   └── urls.py              # Wagtail pages, admin, sitemap
├── mixins/
│   └── inertia/
│       └── base.py          # InertiaMixin: inspects the page class at inheritance, injects serve(); _seo_tags() builds server-side meta tags
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
├── web/                     # React frontend (Inertia client)
│   └── src/
│       └── main.ts          # Inertia app bootstrap + page resolver (require.context)
│       ├── app.css          # Tailwind 4 + shadcn CSS variables + fonts + code highlight
│       ├── pages/           # One React component per page type
│       │   ├── Home.tsx / BlogIndex.tsx / BlogPage.tsx
│       │   ├── ProjectIndex.tsx / ProjectPage.tsx
│       │   ├── SearchPage.tsx
│       │   └── Generic.tsx / NotFound.tsx
│       ├── layouts/
│       │   └── DefaultLayout.tsx  # Navbar + main + Footer wrapper
│       └── lib/
│           ├── Icon.tsx     # lucide-react name->component wrapper
│           ├── Emoji.tsx    # Twemoji via SVGR: lazy glob of web/src/vendor/twemoji/svg/*.svg?react
│           ├── types.ts     # All prop types (StreamBlock union, Post, Nav, Site, etc.)
│           ├── utils.ts     # cn() helper
│           ├── badges.ts    # Mood/license color + label maps (client-side)
│           ├── hooks/
│           │   └── theme.ts # Theme init/toggle (localStorage, dark default)
│           └── components/
│               ├── Navbar.tsx / Footer.tsx / PostCard.tsx
│               └── MoodBadge.tsx / LicenseBadge.tsx / Toc.tsx
│           └── blocks/      # StreamField block components
│               ├── BlockRenderer.tsx  # Dispatcher by block.type
│               ├── AOS.tsx            # IntersectionObserver animation wrapper
│               └── ... (Paragraph, Heading, Quote, Code, Mermaid, TabsBlock, Timeline, etc.)
├── webpack.config.ts        # esbuild + @tailwindcss/webpack + @svgr/webpack, single entry web/src/main.ts
├── webpack-stats.json       # emitted by webpack-bundle-tracker, read by django-webpack-loader
├── static/                  # webpack build output (hashed assets)
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
- **Inertia render:** declare pages as `class ActualPage(Page, InertiaMixin)` (Page first is fine). `InertiaMixin.__init_subclass__` inspects the class at inheritance and injects `serve()`, so Inertia wins over `Page.serve`. `component` is optional and defaults to the class name minus trailing `Page`; set it explicitly when the React filename differs (e.g. `BlogPage`).
- **Auto-dumped props:** `InertiaMixin` introspects the page instance + its view context at runtime. Every concrete model field (and m2m like `tags`) is dumped by type; querysets/paginator pages/tag counts from `get_context()` are dumped too. There are **no per-app serializer files**.
- **StreamField serialization:** each block is auto-dumped as `{ type: <block name>, value: <fields> }`. RichText becomes an HTML string, images become `{url, alt, ...}`, and `StructBlock.get_context()` extras (e.g. Pygments highlighting) are merged. `BlockRenderer.tsx` dispatches on `block.type`; components read `block.value`.
- **Shared chrome:** `InertiaMixin` builds generic meta + nav from the page instance. Apps add more by exporting `shared_props(request, page)` from `<app>.inertia` (e.g. `apps/site_settings/inertia.py`), discovered at runtime. Mood/license **labels** resolve server-side (footer license name, index mood-filter options); mood/license **color classes + labels** resolve **client-side** in `web/src/lib/badges.ts` from just the `mood` / `license_type` key, so the color maps are not shipped in every Inertia payload.
- **Server-side SEO tags:** `InertiaMixin._seo_tags(props)` builds `<title>`, `<meta name=description>`, RSS link, `og:*`, and `twitter:*` tags from `props["meta"]` and passes them via `template_data={"seo_tags": [...]}` to `inertia_render`. `base.html` renders them in `<head>` via `{% block inertia_head %}`, so crawlers see a complete SEO page without JS.
- **Search:** `/search/` is a thin Inertia view (not a Wagtail page). `apps.search.models.search_posts()` runs one lean DB query (`title__icontains | intro__icontains`, no search index, no cache) and returns all live posts; the modal (`SearchPage.tsx`) filters them **client-side** for instant results. Navbar search button + Ctrl/Cmd+K open it. Server-side `?q=` filter also works. Keep the backend lean: preload once, filter in the browser.
- **StreamField blocks:** defined in `apps/blog/blocks.py` (AOS + interactive). Each has a matching React component in `web/src/lib/blocks/`.
- **shadcn + base-ui components:** styling uses shadcn CSS variables (`bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `text-muted-foreground`, `border-border`) instead of DaisyUI component classes. base-ui (`@base-ui/react`) available for interactive primitives. No DaisyUI, no `ui/` wrapper dir - components are hand-written React with Tailwind utility classes + shadcn tokens. TabsBlock is segmented buttons (React state); TooltipBlock uses the native `title` attribute.
- **RichTextField:** all have explicit `feature_names` restriction
- **WAGTAILADMIN_RICH_TEXT_FEATURES:** global feature config set
- **Fonts:** `@fontsource-variable` npm packages (Inter, Plus Jakarta Sans, JetBrains Mono) imported in `web/src/app.css`. webpack emits the woff2 files as hashed `/static/assets/*` URLs (via the `asset` module type) with `unicode-range` subsetting (only the Latin subset downloads on first load). `--font-sans` / `--font-mono` set in `:root`. `Hind Siliguri` is unused (removed).
- **Dot-grid utilities:** `grid-bg`, `dot-grid-light` in `web/src/app.css`.
- **Custom image model:** `tags.BlogImage` via `WAGTAILIMAGES_IMAGE_MODEL = "tags.BlogImage"`. Extends `AbstractImage` with auto palette extraction (modern_colorthief) on save. Palette cached as `palette_json` (JSONField) and `dominant_color_hex` (CharField).
- **Image security:** `WAGTAILIMAGES_MAX_IMAGE_PIXELS = 92_000_000` (~12MP)
- **No `XFrameOptionsMiddleware`** — removed since Wagtail 4.0+ doesn't need it

### Frontend (Inertia + React 19)
- **Inertia.js** — server (inertia-django) serializes props to JSON; client (`@inertiajs/react`) drives SPA navigation. First load = HTML with `<script data-page="app">` + `<div id="app">`; subsequent = XHR JSON.
- **React 19** — functional components, hooks (`useState`, `useEffect`, `useMemo`, `useRef`). No class components. TypeScript throughout.
- **Page resolver** — `require.context('./pages', true, /\.tsx$/, 'eager')` in `main.ts`. Component name (server) = filename (client) without `.tsx`. Note: even in eager mode webpack 5's context function returns a **Promise**, so `resolve` must `await` the result (`const mod = await pageContext(key)`). `import.meta.webpackContext` does NOT work here: esbuild strips its `import.meta` extensions, producing a runtime `{}.webpackContext` crash. Use `require.context` instead.
- **Layout** — `DefaultLayout.tsx` receives `children` (ReactNode) + `nav` + `site`. Navbar/footer persist across page transitions. Inertia's native `{ default, layout }` resolve return is used (no manual wrapping).
- **django-webpack-loader** — `{% render_bundle 'main' 'js' %}` in `base.html` loads the single JS bundle (hash from `webpack-stats.json`). **No `'css'` bundle tag**: styles are injected at runtime by `style-loader` (no CSS file is emitted), and a `render_bundle ... 'css'` tag would block the response forever waiting for a CSS asset that never exists.
- **Tailwind CSS 4** + shadcn CSS variables — dark-first via `.dark` class on `<html>` (default), light mode via removing `.dark`. `@theme inline` bridges semantic tokens (`--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--border`, `--ring`, etc.) into Tailwind utilities.
- **AOS animations** — `AOS.tsx` wrapper uses IntersectionObserver (no AOS library).
- **Theme** — `web/src/lib/hooks/theme.ts` (localStorage, dark default). Toggles the `.dark` class on `<html>` (not `data-theme`). `initTheme()` called before `createInertiaApp` in `main.tsx`. `base.html` sets `class="dark"` on `<html>` before CSS loads to prevent flash.
- **lucide-react** — icons via `Icon.tsx` wrapper. Server sends icon name strings; client maps to lucide-react components.
- **Twemoji (SVGR React components)** — `web/src/vendor/twemoji/svg/` holds all 3,689 Twemoji graphics (CC-BY 4.0). `Emoji.tsx` uses `require.context('../vendor/twemoji/svg', false, /\.svg$/)` (eager) to load every SVG as a React component at module load (via `@svgr/webpack`). The `TWEMOJI` map is keyed by **bare codepoint** (e.g. `2728`, `1f1e8-1f1f3`) - strip both the `./` prefix AND the `.svg` suffix from each context key. Accepts `<Emoji value="✨" className="h-5 w-5" />` (emoji char) or `<Emoji codepoint="1f1e8-1f1f3" />`. Uses the `twemoji` npm package **only** for `twemoji.convert.toCodePoint()` (char -> hex; no network call). **Gotcha 1:** twemoji v14 ESM is `export default` only - `import * as tw` leaves `tw.convert` undefined at runtime, so default-import it (`import twemoji from 'twemoji'`). **Gotcha 2:** webpack's `__webpack_require__.d` wraps the SVGR `default` export as a getter that evaluates to a **React element** (not a component function) on access - `Emoji.tsx` must detect both shapes with `isValidElement(Comp)` and branch. **Gotcha 3:** lowercase JSX variable names (e.g. `<mod />`) are compiled as HTML elements by esbuild, not component references - always use a capital letter for component variables. Note the SVGs carry hardcoded `fill` colors, so `text-*`/`currentColor` won't recolor them - use `filter`/`clip-path`.
- **@svgr/webpack** — the SVG→React loader (replaced `svgr-loader`, which broke against root `@babel/core@8`). Transforms `*.svg` imports into React function components. Do NOT add an `issuer: /\.(tsx|ts)$/` filter to its rule: that blocks `require.context` (webpack contexts have no JS issuer) and breaks every SVG in the Twemoji set. The root Babel 8 / preset-react 8 do not provide the v7 plugins (`@babel/plugin-transform-react-constant-elements`, `@babel/plugin-proposal-object-rest-spread`) that `svgr-loader` hardcodes; `@svgr/webpack` bundles its own self-contained Babel 7 stack, so it builds cleanly.

### Design System
- **Ghost blog:** centered article card, generous whitespace, clean typography
- **Genshin Impact / anime aesthetic:** constellation rails (connected dots + stars), ornamental dividers (gem + prism + sparkles), crown ornaments, crystal frames, dotted borders (`border-dotted`), celestial markers (orbit, compass, infinity)
- **github.blog:** colored mood badges (purple=tech, sky=personal, red=politics, etc.)
- **Sidebar TOC:** Takumi docs style — right-column sticky sidebar. **Grid must be `items-stretch`** (NOT `items-start`): the `aside` must stretch to the full grid row height so the inner `sticky top-24` div has room to travel. `items-start` shrinks the aside to its content height, breaking stickiness. Scroll-spy: threshold-based (last heading whose top <= 100px is active), parent H2 propagation (H3 active also highlights preceding H2). `data-active` attribute (`"true"`/`"false"`) styled via `data-[active=true]:text-primary`. Slug animation: sliding dot + SVG track via stroke-dasharray/dashoffset (follows exact rail curve), track covers all visible headings. Rail path: quadratic curves (H2 straight vertical at x=8.5, H3 curves out to x=16.5 and back). Clean links, H2/H3 indentation, curved SVG rails for H3 items.
- **Blog index:** MakerKit alternating rows, ornamental decorative separators, AOS fade-up on scroll, background dot grid, constellation rails (left/right) with stars/orbits/gems
- **Blog page:** CSS Grid layout (`grid-cols-[auto_auto_1fr_auto]` for left rail + TOC + content + right rail), dotted borders on all frames, ornamental corner sparkles, crown end marker
- **Feminine icon set:** `sparkles` (decorative dots), `infinity` (ornamental curves), `gem` (crystalline), `star` (celestial), `compass` (navigation), `cross` (ornamental), `prism` (crystalline), `orbit` (planetary), `crown` (regal)
- **Color palette:** deep dark (#080809), purple primary, orange accent
- **Typography:** Plus Jakarta Sans (headings/body), Inter (body), JetBrains Mono (code)

### Base Template (Inertia Layout)
- **`base.html`** is a **minimal** Inertia layout: `<html class="dark">` + head (charset, viewport, `{% block inertia_head %}` for server-rendered SEO tags, `{% vite_asset 'web/src/main.tsx' %}`) + body (`{% block inertia %}{% endblock %}`). inertia-django extends it and injects `<script data-page="app">…</script><div id="app">` into the block. SEO/OG/Twitter meta are rendered **server-side** via `_seo_tags()` in `InertiaMixin` (crawlers see a complete page without JS). The React app does not manage `<head>` tags.
- **Theme init** — `<html class="dark">` set before CSS loads. Prevents flash of unthemed content.
- **Nav URLs** resolved server-side by `_nav_props()` from the site root's live children (keyed by slug) and passed as `nav` to all pages.
- **Footer** sticks to bottom via flexbox in `DefaultLayout.tsx`.
- **TOC** — `Toc.tsx` scroll-spy: threshold-based (last heading whose `getBoundingClientRect().top <= 130` is active), parent H2 propagation (H3 active also highlights preceding H2). Sticky sidebar via `sticky top-24` in a grid layout.
- **Reading progress bar** — `BlogPage.tsx` fixed at top, updates on scroll via `useState`.
- **Icons** — `Icon.tsx` wrapper maps server-sent name strings to lucide-react components.
- **Mermaid.js** — `Mermaid.tsx` lazy-renders on scroll intersect via IntersectionObserver.
- **Code copy** — `Code.tsx` copy button reads `block.value.code` (auto-dumped). Feedback via `useState`.
- **Image colors** — `modern_colorthief` palette extraction on save; `dominant_color_hex` is included in the dumped `feed_image` / `image` object.
- **Inertia progress bar** — `progress: { color: '#8b5cf6' }` in `createInertiaApp` config. Shows during SPA navigation.

### React 19 idioms
- **Window/document listeners** — use `useEffect` with a cleanup function for global listeners. Do NOT use `onMount`-style patterns; React's `useEffect` cleanup is the idiomatic equivalent. (Toc scroll-spy, BlogPage reading progress, Navbar Ctrl/Cmd+K follow this.)
- **Derived state** — prefer direct expressions or `useMemo` for computed values. Avoid `useEffect` to synchronise derived state (anti-pattern).
- **Keyed lists** — every `.map()` in JSX has a unique `key` prop by a stable field (`url`, `label`, `name`, `value`, `title`, ...), never the index. Keep `i` only where used (e.g. AOS `delay={i * N}`).
- **One-time mount work** — `useEffect(() => { ... }, [])` with empty deps array is the equivalent of `onMount`. Acceptable for genuinely once-per-mount side effects (e.g. Mermaid's lazy `import("mermaid")` + IntersectionObserver render, Emoji's SVG component loading).
- **Hooks rules** — hooks at top level, conditional hooks not allowed. Use `useRef` for mutable refs, `useState` for reactive state.

## What to Do When...

### Adding a new page type
1. Model in `apps/*/models.py` as `class NewPage(wagtail.models.Page, InertiaMixin)`, type-hint everything
2. Optionally set `component = "NewPage"` (defaults to the class name minus trailing `Page`)
3. Define `parent_page_types` (class refs preferred), `subpage_types`, `search_fields`
4. Define `content_panels` + `editor_panels` with Content/Promote/Settings ObjectLists
5. That's it for the backend — model fields + `get_context()` are auto-dumped. No serializer file.
6. Create `web/src/pages/NewPage.tsx` consuming the field names directly (e.g. `title`, `body`)
7. Add the prop interface to `web/src/lib/types.ts`

### Adding a new StreamField block
1. Create the block class in `apps/blog/blocks.py` (or app-specific blocks file)
2. Set `group` in Meta (Content, Media, Layout, or Interactive)
3. No serializer needed — blocks are auto-dumped as `{ type, value }`
4. Create `web/src/lib/blocks/NewBlock.tsx` reading `block.value.<field>`
5. Add a case in `BlockRenderer.tsx` for the new `block.type`
6. Add the block interface to `web/src/lib/types.ts` and the `StreamBlock` union
7. Register in the model's StreamField choices

### Adding a new React component (UI)
1. Create in `web/src/lib/components/` (shadcn CSS-variable tokens + Tailwind utilities, no `ui/` wrapper)
2. Use destructured props, `useState` for reactive values
3. Use `cn()` for class merging, Tailwind utility classes only
4. Icons via `<Icon name="..." className="..." />`

### Styling
- **Tailwind classes only** — no `<style>` blocks in React components (use `className`)
- Reusable patterns → `@utility` in `web/src/app.css`
- shadcn tokens: `bg-background`, `text-foreground`, `bg-card`, `bg-primary`, `text-muted-foreground`, `border-border`, `text-primary` (opacity via `/NN`)
- Article prose: `prose prose-invert` with inline Tailwind overrides
- **All class names must be literal strings** in React JSX so Tailwind scanner picks them up

### Running the project
- Backend: `uv run python manage.py runserver` (port 8000)
- Frontend dev: `npm run dev` (webpack-dev-server on `http://localhost:3000`, HMR + React Refresh)
- Frontend prod: `npm run build` (emits hashed `static/assets/*` + `webpack-stats.json`; served by WhiteNoise)
- **Dev vs prod serving:** dev loads the bundle from the `:3000` dev server (CORS-allowed for `:8000`); prod loads the same `/static/...` URLs from WhiteNoise. The `render_bundle` tag in `base.html` reads the hash from `webpack-stats.json`, so both modes render identical markup.
- DB: SQLite (dev), PostgreSQL (prod)
