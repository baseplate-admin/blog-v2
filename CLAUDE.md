# CLAUDE.md

## Project Overview

A hyper-modern personal blog powered by **Wagtail CMS** covering technology, personal life, and politics. Dark-first aesthetic inspired by Ghost blog, github.blog (mood badges), and MakerKit articles. SPA-like feel achieved through HTMX boost with zero web components.

**Tech Stack:** Django + Wagtail 7.3 | Vite 7 | Tailwind CSS 4 + DaisyUI | HTMX 4.0.0-beta4 (boost) | AOS (scroll animations) | django-vite 3.1

## Hard Rules

- **NO CDN requests** — never fetch anything from jsDelivr, CDN, or any external URL. All dependencies MUST be installed via npm and bundled through Vite. This includes fonts, scripts, styles, and assets.
- **NO raw CSS in templates** — all styling via Tailwind utility classes. Use `@utility` in `tailwind.css` for reusable patterns.
- **NO CSS-in-templates** — HTMX transition styles injected via JS from `assets/htmx/htmx.ts`.
- **Backend-heavy** — use Python/Django to process everything. Reduce JS payload as much as possible. Server-side rendering for all logic.
- **All deps through npm + Vite** — everything registered via `vite.config.ts` + `{% vite_asset %}`.
- **Full type hints** — type annotations on all functions, methods, and variables. No `from __future__ import annotations` needed (Python 3.14+ has PEP 563 built-in).
- **No em dashes** — use normal dash (-) instead. Never use — or &mdash; in text or templates.
- **Prefer classes over IDs** — use CSS classes for styling and HTMX targeting. Only use IDs when strictly necessary.
- **DRY principle** — reuse Wagtail/framework features instead of building custom endpoints. Use Wagtail API, not custom views.
- **Zero web components** — no Svelte, no custom elements. Everything in Django templates + HTMX.
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
│   │   ├── base.py          # All Django/Wagtail settings
│   │   ├── dev.py           # DEBUG=True, SQLite, debug-toolbar, Vite dev_mode
│   │   └── production.py    # Production overrides
│   ├── templates/
│   │   ├── base.html        # Root: django-vite assets, navbar, footer, HTMX boost wrapper
│   │   ├── components/
│   │   │   └── footer.html  # DaisyUI footer (nav URLs passed from base.html)
│   │   ├── 404.html / 500.html
│   │   └── search/search.html
│   └── urls.py              # Wagtail pages, admin, search, sitemap
├── apps/
│   ├── blog/
│   │   ├── models.py        # BlogIndexPage (pagination, tag filter), BlogPage (mood, StreamField, readtime, TOC headings)
│   │   ├── blocks.py        # AOS StreamField blocks (heading, quote, highlight, separator, image)
│   │   ├── templates/blog/
│   │   │   ├── blog_index_page.html   # Full blog listing with sidebar, inline posts
│   │   │   └── blog_page.html         # Article card, mood badge, TOC sidebar, prose content
│   │   └── templates/blog/blocks/     # AOS block templates (aos_heading, aos_quote, etc.)
│   ├── home/
│   │   ├── models.py        # HomePage (max_count=1, hero, latest posts, featured projects, AOS body)
│   │   ├── blocks.py        # CTABlock (StructBlock: text + url)
│   │   └── templates/home/home_page.html
│   ├── projects/
│   │   └── models.py        # ProjectIndexPage, ProjectPage
│   ├── tags/
│   │   ├── templatetags/site_tags.py  # wagtail_url_from_model_slug tag, mood_badge tag + color mapping
│   │   └── templates/tags/mood_badge.html  # Mood badge HTML (full class names for Tailwind scanning)
│   ├── site_settings/
│   │   └── models.py        # SiteConfigSettings (copyright, license, site name)
│   └── users/
│       ├── models.py        # Custom User (username, email)
│       └── manager.py
├── assets/
│   ├── htmx/htmx.ts         # HTMX config + style injection (no raw CSS)
│   ├── aos/aos.ts           # AOS init (fade-up), DOMContentLoaded + HTMX swap refresh
│   ├── tailwind/
│   │   ├── tailwind.css     # Tailwind 4 + DaisyUI themes, fonts, @utility grid-bg
│   │   └── tailwind.ts
│   └── app.ts               # Minimal inline scripts (theme toggle, keyboard shortcuts)
├── search/                  # Wagtail search view
├── static/                  # Vite build output
├── public/                  # Public assets
├── media/                   # User uploads
└── pyproject.toml           # Python deps
```

## Key Conventions

### Django/Wagtail (heavy backend)
- **Custom user model:** `apps.users.User` (USERNAME_FIELD = "username")
- **Page hierarchy:** Root → HomePage (max_count=1) → BlogIndexPage / ProjectIndexPage
- **BlogPage:** `mood` field, StreamField body (paragraph/image/code + AOS blocks), tags, readtime, Libravatar avatar, reading progress bar
- **Site settings:** `wagtail.contrib.settings` with `SiteConfigSettings`
- **Templates:** `core/templates/` (base, components) + `apps/*/templates/*/` (pages)
- **Template tags:** `wagtail_url_from_model_slug`, `mood_badge`
- **Server-side logic:** search visibility, nav URLs, theme state all rendered server-side
- **AOS blocks:** `AOSHeadingBlock`, `AOSQuoteBlock`, `AOSHighlightBlock`, `AOSSeparatorBlock`, `AOSImageBlock`, `AOSCalloutBlock`, `AOSStatsGridBlock`, `AOSCardGridBlock` in `apps/blog/blocks.py`

### Frontend (Vite + Tailwind — minimal JS)
- **django-vite** registers all assets: `{% vite_asset 'assets/...' %}`, HMR via `{% vite_hmr_client %}`
- **Tailwind CSS 4** + DaisyUI — themes: `tanstack-dark` (default) / `tanstack-light`
- **HTMX boost** — SPA-like navigation, swaps only `<main>`, navbar/footer persist
- **AOS** — scroll animations, init on `DOMContentLoaded`, refreshes on HTMX swap
- **Minimal inline JS** — theme toggle, keyboard shortcuts, mobile menu only

### Design System
- **Ghost blog:** centered article card, generous whitespace, clean typography
- **github.blog:** colored mood badges (purple=tech, sky=personal, red=politics, etc.)
- **Sidebar TOC:** Takumi docs style — left-border rail, scroll-spy, H2/H3 nesting
- **Blog index:** MakerKit alternating rows, decorative lines, AOS fade-up on scroll
- **Color palette:** deep dark (#080809), purple primary, amber accent
- **Typography:** Plus Jakarta Sans (headings/body), Inter (body), Hind Siliguri (Bengali), JetBrains Mono (code)
- **Fonts:** all via npm (@fontsource), bundled through Vite, zero CDN, no fallback fonts

### Base Template
- **Nav URLs** resolved once via `{% wagtail_url_from_model_slug %}`, passed through `{% with %}` to navbar, mobile menu, footer
- **Footer** sticks to bottom via flexbox (`page-shell` flex-col, `boost-root` flex-1)
- **Search button** visibility controlled server-side with `{% if current_path == blog %}`
- **HTMX boost** wraps `<main>` only, navbar/footer persist across swaps
- **Tailwind loaded first** in head to prevent flash of unstyled content
- **Mobile menu** uses vanilla JS dropdown (no popover API), click-outside to close, animate-in fade
- **TOC** rendered server-side via `page.get_toc_headings()`, hybrid JS scroll-spy + smooth-scroll
- **Reading progress bar** fixed at top of blog pages, updates on scroll
- **Theme transition** via `@apply transition-colors` on all key elements
- **Error pages** (404, 500) styled with AOS animations, centered layout
- **Icons** via `{% icon name size=N %}` template tag in `site_tags.py` with Lucide SVG path registry. No Lucide JS — all icons rendered server-side as inline SVGs. Icon names: `arrow-right`, `arrow-left`, `search`, `moon`, `sun`, `menu`, `x`, `github`, `external-link`, `chevron-up`, `calendar`, `list`, `lightning-bolt`, `shield`, `info`, `code`, `chart-bar`, `globe`, `puzzle-piece`
- **Nav progress bar** nprogress-style bar at top shows during HTMX boost requests
- **Infinite scroll** blog index uses HTMX `hx-trigger="intersect"` + `hx-swap="outerHTML"` partial view endpoint
- **Lazy-load** tag cloud uses HTMX 4.x `hx-trigger="load"` pattern
- **HTMX 4.0.0-beta4** all event names use `htmx:phase:action` format (e.g., `htmx:before:request`)
- **Boost container** uses `:inherited` modifiers (`hx-boost:inherited`, `hx-target:inherited="main"`, etc.) + `hx-on::before:swap` safety net to force swaps into `<main>` instead of `<body>`
- **HTMX config**: `noSwap: [204, 304, '4xx', '5xx']` prevents error responses from replacing UI
- **Image colors** via `modern_colorthief` template tags: `get_dominant_color`, `get_palette_colors`

## What to Do When...

### Adding a new page type
1. Model in `apps/*/models.py` inheriting `wagtail.models.Page`, type-hint everything
2. Define `parent_page_types`, `subpage_types`, `content_panels`
3. Template in `apps/*/templates/*/` extending `base.html`
4. All logic server-side via Django template tags

### Adding a new StreamField block
1. Create in `apps/*/blocks.py` with `AOSBlock` base for animations
2. Template in `apps/*/templates/*/blocks/` with `data-aos` attributes
3. Register in model's StreamField choices

### Adding a new Vite entry (library, animation, etc.)
1. Create entry `.ts` file in `assets/`
2. Register in `vite.config.ts` rollupOptions input
3. Load in `base.html` `{% block head %}` with `{% vite_asset %}`

### Styling
- **Tailwind classes only** — no `<style>` blocks in templates
- Reusable patterns → `@utility` in `assets/tailwind/tailwind.css`
- Dynamic styles → injected via JS (`document.createElement('style')`)
- DaisyUI tokens: `bg-base-100`, `text-primary`, `border-base-300`
- Article prose: `prose prose-invert prose-lg` with inline Tailwind overrides
- **All class names must be literal strings** in templates (no dynamic construction) so Tailwind scanner picks them up

### Running the project
- Backend: `uv run python manage.py runserver`
- Frontend: `npm run dev` (Vite HMR) or `npm run build`
- DB: SQLite (dev), PostgreSQL (prod)
