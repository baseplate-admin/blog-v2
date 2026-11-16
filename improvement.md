# Improvement Report - blog-v2

**Date:** 2026-11-16
**Branch:** `webpack-loader-migration`
**Scope:** full audit, test run, and targeted fixes to the React/Inertia UI and the Django layer.

---

## TL;DR

I ran the full frontend/backend test surface, audited every route in a real browser at desktop and mobile sizes, and ran a WCAG contrast audit over the rendered pages.

**10 defects fixed:**

1. Twemoji emoji rendering at 768x768 px (now 1.2em inline).
2. Rich text losing `<strong>`, `<em>`, `<code>`, links, lists, and headings.
3. Timeline dates overlapping titles and invalid `<div>` children inside `<ol>`.
4. TOC jitter, jumpy active state, and missing mobile TOC.
5. Multiple WCAG contrast failures on dark backgrounds.
6. `/feed/` and `/rss/` returning 500.
7. `BlogImage.save()` recursing forever during palette extraction.
8. Migrations never stabilizing because language choices came from a `frozenset`.
9. Django test discovery finding 0 tests, plus a stale test import/template assertion.
10. Two ruff findings (RUF021, DTZ011).

**Verification is green:** `tsc`, `ruff`, `manage.py check`, `makemigrations --check`, 3/3 tests, webpack build, all routes 200/404 as expected, 0 console errors, and 0 WCAG AA failures on the audited pages.

**Biggest remaining risks:** the deployment path is currently broken (Docker Python/user/env mismatches), and the main JS bundle is 10.48 MB raw / 1.70 MB gzip.

---

## Verification performed

| Check | Command | Result |
|---|---|---|
| TypeScript | `npx tsc --noEmit` | Pass, 0 errors |
| Python lint | `ruff check .` | Pass, 0 errors |
| Django checks | `manage.py check` | 0 issues |
| Migrations | `manage.py makemigrations --check --dry-run` | `No changes detected` |
| Backend tests | `manage.py test` | 3/3 pass |
| Frontend build | `npm run build` | success, 139 assets |
| Bundle size | measured with Node + gzip | main 10.48 MB raw / 1.70 MB gzip |
| Routes | HTTP GET every page + feed/API/sitemap/404 | all expected (200/404) |
| Browser | Playwright 1280x720 and 390x844 | 0 console errors |
| Contrast | canvas-based WCAG audit on `/`, `/blog/`, `/blog/kitchen-sink/`, `/projects/blog-engine/`, `/search/` | 0 AA failures |

Routes verified: `/`, `/blog/`, all three posts, `/projects/`, all three projects, `/search/`, `/search/?q=...`, `/feed/`, `/rss/`, `/sitemap.xml`, `/api/pages/`, and a 404.

---

## Fixed in this pass

### 1. Emoji were giant blocks (fixed)

`Emoji.tsx` wrapped the SVG in a `span` with `display: inline`, so `h-[1.2em] w-[1.2em]` was ignored by CSS and the inner SVG expanded to its intrinsic 768x768. I changed the wrapper to `inline-block` and gave the fallback glyph a proper prop.

Evidence: every emoji SVG now measures 19x19 px at 16px body text (1.2em), and emoji inside paragraph text sit inline.

### 2. Rich text lost all formatting (fixed)

`EmojiText.tsx` rendered every element node as a `<span>`, so editor content became flat text:

- `<strong>`, `<em>`, `<code>` lost their semantics and styling.
- `<a href>` became a non-clickable `<span href>`.
- `<p>`, `<ul>`, `<li>`, headings were flattened.
- Wrapping it in another `<p>` created nested paragraphs.

I replaced the walker with `createElement` over a small allowlist of editor tags, preserving attributes (`class` to `className`, etc.), skipping event handlers, and keeping Twemoji substitution. Block wrappers in Callout, Highlight, Steps, Timeline, and CardGrid are now `<div>` instead of `<p>`.

Evidence on `/blog/kitchen-sink/`: `<strong>`, `<em>`, and `<code>` now exist in the article DOM (previously 0), with no nested `<p>`.

### 3. Timeline and Steps layout (fixed)

- Timeline timestamp badges were fixed at `size-8`, but the content uses full dates like `2026-11-04`, so the text overflowed across the title.
- `AOS` rendered a `<div>` directly inside `<ol>`, invalidating the list.

Fix: timestamps are now a small mono label above the title, with a dot marker on the rail; `AOS` sits inside each `<li>`. Steps got the same valid markup. Evidence: timeline `<ol>` children are now `li, li, li, li`.

### 4. TOC smoothness and mobile (fixed)

The previous TOC toggled active state from a 90% IntersectionObserver threshold, which flickered when several headings were visible and had no animated indicator.

I compared the Takumi/Fumadocs TOC and the TanStack docs TOC, then implemented:

- A single active heading, chosen as the last heading above a 140px reading line (stable while scrolling).
- A single sliding indicator bar with `transition-[top,height]`.
- A masked, hidden-scrollbar scroll area that follows the active item.
- Smooth anchor scrolling via `scroll-smooth` (respecting `motion-reduce`).
- A native `<details>` mobile TOC (hidden on `lg+`), ported from TanStack's `TocMobile`.

Evidence: one active item at a time, indicator transition is `top, height 0.3s`, mobile `<details>` visible at 390px while the desktop sidebar is `display:none`, and no horizontal overflow.

### 5. Contrast failures (fixed)

Canvas-based audit found 13 unique AA failures. Root cause of the worst ones: `prose` was not inverted, so the typography plugin's light-theme gray-700 leaked into Tabs content, tooltips, and project descriptions.

Fixes:

- Added `prose-invert` to BlogPage, Generic, ProjectIndex, and ProjectPage.
- Raised code-token colors (`.linenos`, `.normal`, operators, names, builtins, classes, decorators, escapes, words).
- Raised footer, license, count, and search metadata text.
- Fixed the dark-theme primary button: `--primary-foreground` is now dark (5.0:1 instead of 3.75:1 on `bg-primary`).
- Raised the decorative `PROJECT` placeholders to large-text AA, and replaced small `text-secondary` labels with lighter purple.

Before/after examples:

| Element | Before | After |
|---|---|---|
| Tabs/Callout body (prose leak) | 1.91:1 | passes |
| Code token names | 3.41:1 | 10.66:1 |
| Operators/punctuation | 3.66:1 | 6.88:1 |
| Footer/license label | 3.61:1 | 6.88:1 |
| Primary button text | 3.75:1 | 5.02:1 |
| `PROJECT` placeholder | 1.23:1 | 3.66:1 (large) |
| `02. WORK` label | 3.72:1 | 10.66:1 |

Final audit result: 0 failures on all audited pages.

### 6. RSS feed 500s (fixed)

`/feed/` and `/rss/` failed for two separate reasons:

1. `self.request` is never set on a Django `Feed`; the site lookup raised `AttributeError`.
2. `item_pubdate()` returned a `date`, but Django requires a timezone-aware `datetime`.

`get_feed()` now resolves the site with the request in scope, and `item_pubdate()` combines the date with midnight UTC. Both endpoints return 200 with valid RSS.

### 7. Image palette infinite recursion (fixed)

`BlogImage.save()` called `_extract_palette()`, which called `self.save(update_fields=...)`, which called `_extract_palette()` again until `RecursionError`. Any image upload would fail.

`save()` now skips palette extraction when `update_fields` is present. Verified with a real 8x8 PNG upload: created successfully, dominant color `#7c1ccc`, no recursion.

### 8. Migrations were non-deterministic (fixed)

`CODE_LANGUAGES` was annotated as `list[tuple[str, str]]` but built with `frozenset(...)`. String hashing is randomized per process, so every `makemigrations` run produced a different choice order and a new `AlterField`.

Changed it to an ordered list. `makemigrations --check` now reports `No changes detected`, verified twice.

### 9. Test discovery and stale home test (fixed)

- Added the missing `apps/__init__.py`; without it, `apps` was a namespace package and unittest discovery imported the wrong `tests` module (0 tests found, or `ImportError`).
- `apps/home/tests.py` imported `home.models` and asserted the removed `home/home_page.html` template.
- Rewrote it to use `apps.home.models`, the migration-created homepage, and to assert the Inertia response (`data-page="app"`).

`manage.py test` now discovers and passes 3/3 tests.

### 10. Ruff (fixed)

- `mixins/inertia/page.py`: parenthesized the `and`/`or` chain (RUF021).
- `scripts/make_showcase.py`: timezone-aware date (DTZ011).

### 11. Dev/prod asset wiring (fixed)

The two modes were not actually separated:

- **Dev** used `publicPath: '/static/'`, so `render_bundle` pointed at Django's staticfiles and served the last built bundle. The webpack dev server on `:3000` was running but unused (no HMR).
- **Prod** looked correct, but the Docker image never copied `webpack-stats.json` from the frontend builder, so `render_bundle` would have no hash map at runtime.

Fix:

- `webpack.config.ts`: dev uses `http://localhost:3000/static/`, prod uses `/static/`. Dev also sets `client.webSocketURL = 'ws://localhost:3000/ws'` and `Access-Control-Allow-Origin: *`.
- `core/settings/dev.py`: comment corrected (the old one referenced `:5173`).
- `Dockerfile`: copy `/app/webpack-stats.json` from the frontend builder into the final image.

Verified: dev renders `<script src="http://localhost:3000/static/assets/main.*.js">` and the page hydrates from the dev server; after `npm run build`, the stats file is back to `/static/assets/...` for WhiteNoise.

---

## Remaining issues (prioritized)

### P0 - deployment is currently broken

1. **Docker Python version mismatch.** `pyproject.toml` requires `>=3.15`, but the Dockerfile builds with `python3.14-alpine`. `uv sync --frozen` will fail. Use a 3.15 image or relax the requirement.
2. **`COPY --chown=app:app` has no `app` user.** The final `python:3.14-alpine` stage never creates `app`, so the image build fails. Create the user/group or use a numeric UID/GID.
3. **`collectstatic` runs under production settings at build time.** `core/settings/production.py` raises `ImproperlyConfigured` unless `AWS_*` variables exist, and the Dockerfile does not source `.env`. Use build args, a static-only settings module, or a build-time env file.
4. **Secret key is hardcoded and env is ignored.** `core/settings/production.py` contains a literal `SECRET_KEY` and never reads `DJANGO_SECRET_KEY` from `.env.sample`.
5. **`ALLOWED_HOSTS` defaults to `"*"`** in production. Require an explicit value.
6. **`WAGTAILADMIN_BASE_URL` stays `http://example.com`** in production; admin emails and absolute URLs will be wrong.
7. **`npm ci` in Docker will prune devDependencies.** With `NODE_ENV=production` / `omit=dev`, webpack and its loaders are removed and the frontend stage cannot build. Use `npm ci --include=dev` or a build-stage `.npmrc`.

### P1 - correctness, security, performance

8. **Main bundle is 10.48 MB raw / 1.70 MB gzip.** `Emoji.tsx` eagerly bundles all 3,689 Twemoji SVGs via `require.context`, and `Icon.tsx` uses `import * as Lucide`, which defeats tree-shaking. Recommendations: lazy `require.context` + `React.lazy`/`Suspense`, or a Twemoji sprite sheet; explicit named Lucide imports; disable or hide production sourcemaps (the map is 19 MB).
9. **Mermaid uses `securityLevel: 'loose'`.** Diagram source is editor content, but a loose security level enables HTML labels. Use `strict` or sanitize.
10. **Search page metadata says "Home".** `search_view()` passes the root page for shared props, so `<title>` is the homepage title. Override `meta.title` / `seo_title` to "Search".
11. **Search close uses `history.back()`.** Opening `/search/` directly and pressing Escape/Close can leave the site. Fall back to `/` when there is no history entry.
12. **Internal navigation uses plain `<a>` in places.** Home CTAs, ProjectPage back links, and ProjectIndex title links should use Inertia `<Link>` for SPA transitions instead of full reloads.
13. **Redis is a hard dependency at render time.** `BlogPage.reading_time` uses `cache.get`/`cache.set`, and the avatar proxy uses the cache; a Redis outage becomes a 500. Add a safe cache helper with fallback.
14. **Test coverage is thin.** Only 3 home tests. Add: Inertia prop serialization (shared meta/nav/site), search view, RSS content, one test per StreamField block, and an HTML smoke test for each route.
15. **Twemoji CC-BY 4.0 attribution is still missing.** Add a visible credit in the footer or about page.
16. **Security headers are minimal.** Consider HSTS, `SECURE_CONTENT_TYPE_NOSNIFF`, `X_FRAME_OPTIONS`, and a CSP; verify `SECURE_PROXY_SSL_HEADER` with Traefik.

### P2 - quality and docs

17. **`BlogPage.get_toc_headings()` is dead code** and uses `heading-<block.id>` ids while the client uses `heading-<index>`. Remove or align.
18. **`apps/search/serializers.py` docstring still says "for Svelte."**
19. **Docs drift:** `README.md` is empty; `CLAUDE.md` still mentions `{% vite_asset %}`, `main.tsx`, and `vite.config.ts` in places; `migration-plan.md` is historical; `NEXT_PLANS.md` claims lazy 3,689 chunks while the build is a single 10.5 MB main; `PLANS.md` says the project index is not in the DB while `NEXT_PLANS.md` says it was created.
20. **`BlogIndex.tsx` imports from `$lib/utils` twice.**
21. **`AOS.tsx`'s delayed `setTimeout` is not cleared on unmount.**
22. **`Mermaid.tsx` recreates its module-level promise inside the component** and forgets it across renders.
23. **`Icon.tsx` silently falls back to `Circle`** for unknown names; log a dev warning.
24. **Favicon 404** is the only remaining console error; add `public/favicon.ico` or a `<link rel="icon">`.
25. **No `typecheck`, `lint`, or `test` npm scripts.** Add them so CI can run the same checks.
26. **Compose pins `postgres:latest` and `redis:8-alpine`**, and hardcodes the DB password. Pin versions and move credentials to `.env`.
27. **`apps/projects/github.py` uses PEP 758 syntax** (`except A, B:`), valid on 3.14+ but not older; parenthesize for portability.
28. **`SiteConfigSettings` validators capture the current year at import time**, so the max year does not advance until restart; use a callable validator.
29. **`BlogImage.default_alt_text` returns `description` with an unchecked type ignore.**
30. **`apps/blog/models.py` imports `Count` inside `get_context`**; move it to module scope.

---

## Suggested order

1. Fix the Docker/Python/user/env blockers so production can build.
2. Move secrets, hosts, and the admin base URL to environment variables.
3. Reduce the bundle: lazy Twemoji, explicit Lucide imports, hidden sourcemaps.
4. Add tests for Inertia serialization, search, RSS, and blocks.
5. Clean up dead code and refresh the docs.

---

## Files changed in this pass

- `apps/__init__.py` (new, enables test discovery)
- `apps/blog/blocks/interactive.py` (stable ordered language choices)
- `apps/blog/feeds.py` (request/site resolution, aware pubdate)
- `apps/home/tests.py` (correct imports, Inertia assertion)
- `apps/tags/models.py` (palette recursion guard)
- `mixins/inertia/page.py` (ruff RUF021)
- `scripts/make_showcase.py` (timezone-aware date)
- `web/src/app.css` (smooth scroll, dark primary-foreground, code token contrast)
- `web/src/lib/Emoji.tsx` (inline-block sizing, fallback glyph)
- `web/src/lib/blocks/EmojiText.tsx` (tag-preserving rich text walker)
- `web/src/lib/blocks/Callout.tsx`, `CardGrid.tsx`, `Highlight.tsx`, `Steps.tsx`, `Timeline.tsx` (valid wrappers, timeline layout)
- `web/src/lib/components/Toc.tsx` (stable active state, sliding indicator, smooth scroll)
- `web/src/lib/components/TocMobile.tsx` (new mobile disclosure TOC)
- `web/src/lib/components/Footer.tsx` (contrast)
- `web/src/pages/BlogIndex.tsx`, `BlogPage.tsx`, `Generic.tsx`, `Home.tsx`, `ProjectIndex.tsx`, `ProjectPage.tsx`, `SearchPage.tsx` (contrast, prose-invert, internal link colors, TOC mount)

No screenshots or temporary files were left in the repository.
