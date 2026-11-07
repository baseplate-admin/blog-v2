# Migration Plan: Svelte → React (Inertia UI layer)

Status: **planned, not executed**
Scope: replace the entire `web/` UI layer (Svelte 5 + `@inertiajs/svelte`) with React + `@inertiajs/react`.
Backend is **not** changing: `mixins/inertia/base.py`, the generic page/StreamField dump, and Inertia component names stay as-is.

---

## 1. Current state (what exists today)

- Django + Wagtail render Inertia responses via `inertia.render(request, component, props)`.
- `component` names: `Home`, `BlogIndex`, `BlogPage`, `ProjectIndex`, `ProjectPage`, `SearchPage`, `Generic`, `NotFound`.
- Props are auto-dumped server-side (model fields + `get_context()`); no per-page serializers.
- `web/src` is Svelte 5:
  - `main.ts`, `layouts/DefaultLayout.svelte`
  - `pages/*.svelte` (8 pages)
  - `lib/Icon.svelte`, `Emoji.svelte`, `types.ts`, `utils.ts`, `badges.ts`, `hooks/theme.ts`
  - `lib/components/{Navbar,Footer,PostCard,Toc,MoodBadge,LicenseBadge}.svelte`
  - `lib/components/ui/{button,badge,card,separator,tabs,tooltip,alert}` (hand-written shadcn-svelte on bits-ui)
  - `lib/blocks/*.svelte` (18 files: `BlockRenderer`, `AOS`, and each StreamField block)
- Twemoji: `web/src/vendor/twemoji/svg/` (3,689 SVGs), loaded by a **lazy** `import.meta.glob` (`?raw`) → 835 KB main + 3,689 chunks. This behavior is intentional and must be preserved.
- `vite.config.ts`: `svelte()` plugin, `publicDir: false`, `optimizeDeps.noDiscovery: true` (workaround for Vite 8 scanning bits-ui's type-only `svelte/elements` import).
- `svelte.config.js` exists only because the Svelte toolchain was added during debugging.
- `base.html` loads `{% vite_asset 'web/src/main.ts' %}`.

### Known environment gotcha
The shell currently has `NODE_ENV=production`; combined with `npm config omit=dev`, `npm install` will prune devDependencies. Always install with `--include=dev` (or unset `NODE_ENV`) during this migration.

---

## 2. Target stack

| Layer | Replace with |
|---|---|
| UI | React 19 + `react-dom` |
| Inertia adapter | `@inertiajs/react` (match installed Inertia core, currently `3.11.0`) |
| Vite plugin | `@vitejs/plugin-react` |
| Icons | `lucide-react` |
| UI primitives | shadcn/ui-style React components (Radix primitives optional; hand-rolled is acceptable) |
| Language | TypeScript with `jsx: "react-jsx"` |

Keep: `tailwindcss`, `@tailwindcss/vite`, `@tailwindcss/typography`, `typescript`, `vite`, `mermaid`, `twemoji`, `clsx`, `tailwind-merge`, `class-variance-authority`, `tw-animate-css`.

Remove: `svelte`, `@sveltejs/vite-plugin-svelte`, `@inertiajs/svelte`, `bits-ui`, `lucide-svelte`, `svelte.config.js`.

---

## 3. File mapping

| Svelte | React |
|---|---|
| `web/src/main.ts` | `web/src/main.tsx` |
| `web/src/layouts/DefaultLayout.svelte` | `layouts/DefaultLayout.tsx` |
| `web/src/pages/Home.svelte` | `pages/Home.tsx` |
| `web/src/pages/BlogIndex.svelte` | `pages/BlogIndex.tsx` |
| `web/src/pages/BlogPage.svelte` | `pages/BlogPage.tsx` |
| `web/src/pages/ProjectIndex.svelte` | `pages/ProjectIndex.tsx` |
| `web/src/pages/ProjectPage.svelte` | `pages/ProjectPage.tsx` |
| `web/src/pages/SearchPage.svelte` | `pages/SearchPage.tsx` |
| `web/src/pages/Generic.svelte` | `pages/Generic.tsx` |
| `web/src/pages/NotFound.svelte` | `pages/NotFound.tsx` |
| `lib/Icon.svelte` | `lib/Icon.tsx` |
| `lib/Emoji.svelte` | `lib/Emoji.tsx` |
| `lib/components/Navbar.svelte` | `lib/components/Navbar.tsx` |
| `lib/components/Footer.svelte` | `lib/components/Footer.tsx` |
| `lib/components/PostCard.svelte` | `lib/components/PostCard.tsx` |
| `lib/components/Toc.svelte` | `lib/components/Toc.tsx` |
| `lib/components/MoodBadge.svelte` | `lib/components/MoodBadge.tsx` |
| `lib/components/LicenseBadge.svelte` | `lib/components/LicenseBadge.tsx` |
| `lib/components/ui/*` | `lib/components/ui/*.tsx` + barrel `index.ts` |
| `lib/blocks/*.svelte` | `lib/blocks/*.tsx` |

Unchanged: `lib/types.ts`, `lib/utils.ts`, `lib/badges.ts`, `lib/hooks/theme.ts`, `app.css`, `vendor/twemoji/svg/`.

---

## 4. Phase-by-phase

### Phase 0 — Prep
1. Stop the running dev servers (`npm run dev`, Django `runserver`) to avoid file-lock/port issues.
2. Create a dedicated branch or commit the current Svelte state (fallback).
3. Note the desired Twemoji behavior: **lazy glob → 835 KB main + 3,689 chunks**.

### Phase 1 — Toolchain / dependencies
```bash
# Ensure dev deps are installed even with NODE_ENV=production
npm uninstall svelte @sveltejs/vite-plugin-svelte @inertiajs/svelte bits-ui lucide-svelte
npm install --include=dev react react-dom @inertiajs/react lucide-react
npm install --include=dev -D @vitejs/plugin-react @types/react @types/react-dom
```
- Remove `svelte.config.js`.
- Keep `publicDir: false` (Twemoji is handled by the lazy glob; do not copy 3,689 files twice).
- Remove `optimizeDeps.noDiscovery` once bits-ui (the `.svelte` + `svelte/elements` source) is gone.

### Phase 2 — Config
`vite.config.ts`:
- `import react from '@vitejs/plugin-react'`; plugins `[react(), tailwindcss()]`.
- `build.rollupOptions.input.main = resolve('./web/src/main.tsx')`.
- Keep `base: '/static/'`, `server.origin`, `$lib` alias, `sourcemap: true`.
- Drop `optimizeDeps.noDiscovery` (React has no `.svelte` deps).
- Keep `publicDir: false`.

`tsconfig.json`:
- Add `"jsx": "react-jsx"`.
- Add `"DOM.Iterable"` to `lib`.
- `"types": ["vite/client", "node"]` (keep).
- Keep `verbatimModuleSyntax` (use `import type` consistently).
- Add a `typecheck` script (`tsc --noEmit`) if desired.

`core/templates/base.html`:
- `{% vite_asset 'web/src/main.tsx' %}`.

### Phase 3 — Entry + layout
`web/src/main.tsx`:
- `createInertiaApp` from `@inertiajs/react`.
- `resolve` uses `import.meta.glob('./pages/**/*.tsx', { eager: true })`.
- Apply `DefaultLayout` via the adapter’s layout support (verify `@inertiajs/react` accepts `{ default, layout }`); otherwise wrap in `resolve` or use the global `layout` option.
- `setup({ el, App, props }) { createRoot(el).render(<App {...props} />) }`.
- `progress: { color: '#8b5cf6' }`.

`layouts/DefaultLayout.tsx`:
- Props: `nav`, `site`, `meta`, `children`.
- Render `Navbar`, `<main>{children}</main>`, `Footer`.
- Metadata: React 19 can hoist `<title>` / `<meta>` rendered in the component. If staying on React 18, add a small `useDocumentMeta(meta)` effect (or `react-helmet-async`).
- Keep the same OG/Twitter tags as the Svelte `<svelte:head>`.

### Phase 4 — Shared lib
- `Icon.tsx`: port the existing `ICON_MAP` to `lucide-react` components; keep the same server-side names (`github`→`GitBranch`, `lightning-bolt`→`Zap`, `puzzle-piece`→`Blocks`, `prism`→`Diamond`, etc.). Verify each export in `lucide-react` (some icons were renamed, e.g. `ChartBar`).
- `Emoji.tsx`: keep the **lazy** `import.meta.glob('../vendor/twemoji/svg/*.svg', { query: '?raw', import: 'default' })`; load per codepoint in `useEffect`, inline via `dangerouslySetInnerHTML` on a wrapper that styles the inner SVG (`[&>svg]:h-full [&>svg]:w-full`). Preserve the 835 KB + chunks target.
- `types.ts`, `utils.ts`, `badges.ts`, `hooks/theme.ts`: no changes.

### Phase 5 — UI primitives (`lib/components/ui`)
Port each Svelte primitive to a React `.tsx` with the same Tailwind classes/API:
- `button.tsx` — `cva` variants; internal `href` (`/...`) uses Inertia `<Link>`, else `<a>`/`<button>`.
- `badge.tsx` — variant map.
- `card.tsx` — `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- `separator.tsx` — plain div.
- `tabs.tsx` — `Tabs`/`TabsList`/`TabsTrigger`/`TabsContent` with React state/context. **Fix:** the Svelte block passes a static `value`; use internal state (`defaultValue`/`useState`) so clicking tabs actually switches.
- `tooltip.tsx` — hover/focus tooltip with `Tooltip`/`TooltipTrigger`/`TooltipContent`; simple absolute positioning is enough, or use `@radix-ui/react-tooltip` for parity.
- `alert.tsx` — `Alert`/`AlertTitle`/`AlertDescription`.
- Add `index.ts` barrels mirroring the Svelte ones.

### Phase 6 — App components
- `Navbar.tsx`: `Link`, `router`, `usePage()` for the current URL; theme toggle via `useState` + `toggleTheme()`; `useEffect` for Ctrl/Cmd+K → `router.get('/search/')`.
- `Footer.tsx`: `Link` + `licenseBadge`.
- `PostCard.tsx`: `Link`, `formatDate`, `readingTime`, `MoodBadge`, `LicenseBadge`, Card primitives.
- `Toc.tsx`: `useState` + `useEffect` scroll-spy (port the threshold/H2-propagation logic; cleanup listener).
- `MoodBadge.tsx`, `LicenseBadge.tsx`: straightforward.

### Phase 7 — Pages
Port each page 1:1. Props are unchanged (server dump). Key conversions:
- `$props()` → a `Props` interface + destructuring.
- `$derived` → `useMemo` (or direct expressions).
- `$effect` → `useEffect` with cleanup.
- `$state` → `useState`.
- `{#if}` / `{#each}` → JSX conditionals / `.map` with `key`.
- `{@html x}` → `dangerouslySetInnerHTML={{ __html: x }}`.
- `onclick` / `bind:value` → `onClick` / `value` + `onChange`.
- `class` → `className`; `style:...` → `style`.
- `page.url` (Svelte page store) → `usePage().url` (or `window.location.pathname`).
- `router.get(...)` stays `router.get(...)` from `@inertiajs/react`.

Specific notes:
- `BlogPage`: TOC derived from `body` (`aos_heading` h2/h3), tag links, updated indicator, author avatar (`/avatar/<owner.id>/`).
- `BlogIndex`: `blogpages.items`, `number/num_pages/has_next/has_previous`, `tag_cloud[].tag__name`, `mood_choices` tuples.
- `Home`: `hero_ctas[].value`, `latest_posts`, `featured_projects`.
- `SearchPage`: keyboard handling via `onKeyDown`, `router.get`, `history.back()`.
- `NotFound`: `router.get('/')`, `nav.blog`.

### Phase 8 — Block components
Port all 18:
- `AOS.tsx` — `IntersectionObserver` + `useState` (port `OFFSET` map and `delay` handling).
- `BlockRenderer.tsx` — switch on `block.type`.
- `Paragraph`, `Heading`, `Quote`, `Highlight`, `Separator`, `Image` (handle both `image` and `inline_image`), `Mermaid` (dynamic `import('mermaid')` + intersection), `Code` (copy state), `Callout`, `StatsGrid`, `CardGrid`, `Tabs`, `Timeline`, `Steps`, `Alert`, `TooltipBlock`.
- All read `block.value` (the lazy/generic backend shape).
- Use `dangerouslySetInnerHTML` for HTML fields (`paragraph`, `code.highlighted`, `tabs.content`, rich text).

### Phase 9 — Cleanup
- Delete all `.svelte` files, `main.ts`, `svelte.config.js`.
- Remove `svelte`/`bits-ui`/`lucide-svelte`/`@inertiajs/svelte` from lockfile/node_modules.
- Update `CLAUDE.md` / `NEXT_PLANS.md` (Svelte references → React, `svelte:head` → React metadata, `$props` etc.).
- Ensure no `optimizeDeps.noDiscovery` workaround remains (the bits-ui `.svelte` trigger is gone).

### Phase 10 — Verification
Backend:
```bash
uv run python manage.py check
uv run python manage.py makemigrations --check --dry-run
```
Frontend:
```bash
npm run build           # expect ~835 KB main + 3,689 Twemoji chunks
npx tsc --noEmit        # or add a `typecheck` script
npm run dev
```
Runtime (Playwright or browser):
- Routes: `/`, `/blog/`, `/blog/<post>/`, `/projects/`, `/projects/<project>/`, `/search/?q=django`.
- Console: 0 errors (favicon 404 optional to fix).
- Navigation: navbar + post cards are SPA visits (no full reload).
- Twemoji: 3 SVGs on the home hero, loaded from chunks.
- Theme toggle + Ctrl/Cmd+K.
- Every block type renders (create/publish a test page with each block if needed).

Docker/prod:
- `npm run build` is used in the Docker frontend stage.
- `collectstatic` still ships `static/` (main + chunks + maps).
- Sourcemaps remain enabled (`build.sourcemap: true`).

---

## 5. Risks / gotchas

1. **Inertia React layout API** — confirm whether `resolve` accepts `{ default, layout }`. If not, wrap pages or use the global `layout` option; avoid remounting the layout on every navigation if possible.
2. **Metadata** — `<svelte:head>` has no direct React equivalent. Use React 19’s document metadata hoisting (preferred) or a small `useEffect`-based meta hook.
3. **Tabs bug** — the current Svelte block passes a static `value`; implement React tabs with internal state so switching works.
4. **Icon renames** — some lucide names differ between `lucide-svelte` and `lucide-react` (`ChartBar`, etc.); fix the map at compile time.
5. **Event/attribute syntax** — `class`→`className`, `onclick`→`onClick`, `bind:`→controlled inputs.
6. **HTML injection** — all rich text/StreamField HTML must go through `dangerouslySetInnerHTML`.
7. **Twemoji** — keep the lazy glob; do not switch to `eager: true` (that produces a ~9.2 MB main). `publicDir` stays `false`.
8. **NODE_ENV=production** — use `npm install --include=dev` or unset `NODE_ENV`; otherwise devDependencies are pruned.
9. **Backend untouched** — the generic Inertia dump is adapter-agnostic; no Django/Inertia changes required beyond `base.html`’s asset path.
10. **Browser automation** — verify SPA navigation with a persisted `window` flag (no full reload) and check console errors after each route.

---

## 6. Suggested execution order (checkpoints)

1. Deps + config + `main.tsx` + `DefaultLayout` + `Icon`/`Emoji` → app boots.
2. UI primitives + `Navbar`/`Footer`/`PostCard` → layout renders.
3. Pages (Home, Blog, Projects, Search, Generic, NotFound) → routes render.
4. Blocks + `BlockRenderer`/`AOS` → article body renders.
5. Delete Svelte files, update docs, full build/runtime verification.

Stop after each checkpoint and run `npm run build` + a Playwright smoke test before moving on.
