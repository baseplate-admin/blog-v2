# CLAUDE.md

## Project Overview

A hyper-modern personal blog powered by **Wagtail CMS** covering technology, personal life, and politics. Dark-first aesthetic inspired by Ghost blog, github.blog (mood badges), MakerKit comparison articles, and modern documentation sidebars (Takumi docs style).

**Tech Stack:** Django + Wagtail 7.3 | Svelte 5 (custom elements) | Vite 7 | Tailwind CSS 4 + DaisyUI | HTMX (integrated) | AOS (scroll animations) | PyScript | django-vite 3.1

## Hard Rules

- **NO CDN requests** — never fetch anything from jsDelivr, CDN, or any external URL. All dependencies MUST be installed via npm and bundled through Vite. This includes fonts, scripts, styles, and assets.
- **NO raw CSS in templates** — all styling via Tailwind utility classes. Use `@utility` in `tailwind.css` for reusable patterns.
- **NO CSS-in-templates** — HTMX transition styles injected via JS from `assets/htmx/htmx.ts`.
- **Frontend-heavy** — delegate as much processing as possible to JS/Svelte. Backend should be thin (data + templates only).
- **All deps through npm + Vite** — everything registered via `vite.config.ts` + `{% vite_asset %}`.
- **Full type hints** — every Python file has `from __future__ import annotations` + type annotations on all functions, methods, and variables.
- **No em dashes** — use colons, commas, or periods instead. Never use — in text.
- **Prefer classes over IDs** — use CSS classes for styling and HTMX targeting. Only use IDs when strictly necessary.
- **DRY principle** — reuse Wagtail/framework features instead of building custom endpoints. Use Wagtail API, not custom views.

## Project Structure

```
blog/
├── core/
│   ├── settings/
│   │   ├── base.py          # All Django/Wagtail settings
│   │   ├── dev.py           # DEBUG=True, SQLite, debug-toolbar, Vite dev_mode
│   │   └── production.py    # Production overrides
│   ├── templates/
│   │   ├── base.html        # Root: django-vite assets (htmx, aos, tailwind, fonts), wagtailuserbar
│   │   ├── components/
│   │   │   ├── navbar.html  # Renders <custom-navbar> Svelte CE + passes Wagtail URLs
│   │   │   └── footer.html  # DaisyUI footer with site settings
│   │   ├── 404.html / 500.html
│   │   └── search/search.html
│   └── urls.py              # Wagtail pages, admin, search, sitemap
├── apps/
│   ├── blog/
│   │   ├── models.py        # BlogIndexPage (pagination, tag filter), BlogPage (mood, StreamField, readtime)
│   │   ├── templates/blog/
│   │   │   ├── blog_index_page.html   # HTMX swappable container, AOS animations
│   │   │   ├── blog_page.html         # Article card, mood badge, TOC sidebar, prose content
│   │   │   └── _blog_posts.html       # HTMX partial: post cards + pagination
│   ├── home/
│   │   ├── models.py        # HomePage (max_count=1, hero, latest posts, featured projects)
│   │   ├── blocks.py        # CTABlock (StructBlock: text + url)
│   │   └── templates/home/home_page.html
│   ├── projects/
│   │   └── models.py        # ProjectIndexPage, ProjectPage
│   ├── tags/
│   │   └── templatetags/wagtail_tags.py  # wagtail_url_from_model_slug tag
│   ├── site_settings/
│   │   └── models.py        # SiteConfigSettings (copyright, license, site name)
│   └── users/
│       ├── models.py        # Custom User (username, email)
│       └── manager.py
├── assets/
│   ├── htmx/htmx.ts         # HTMX config + style injection (no raw CSS)
│   ├── aos/aos.ts           # AOS init (github.blog-style fade-up), refreshes on HTMX swap
│   ├── components/
│   │   ├── Navbar.svelte    # <custom-navbar> - nav, theme toggle, mobile popover
│   │   ├── TableOfContents.svelte  # <table-of-contents> - scroll-spy, smooth scroll
│   │   └── MoodBadge.svelte # <mood-badge> - mood→color mapping (frontend-only)
│   ├── icons/               # Svelte icon CEs (X, RightArrow, Calendar, Eye, Circle, TOC)
│   ├── tailwind/
│   │   ├── tailwind.css     # Tailwind 4 + DaisyUI themes, @utility grid-bg, Inter font
│   │   └── tailwind.ts
│   ├── fonts/inter/         # Inter variable font
│   ├── twemoji/             # Twemoji
│   └── functions/props.ts   # normalizeProps for CE attribute → prop
├── search/                  # Wagtail search view
├── static/                  # Vite build output
├── public/                  # Public assets
├── media/                   # User uploads
└── pyproject.toml           # Python deps
```

## Key Conventions

### Django/Wagtail (thin backend)
- **Custom user model:** `apps.users.User` (USERNAME_FIELD = "username")
- **Page hierarchy:** Root → HomePage (max_count=1) → BlogIndexPage / ProjectIndexPage
- **BlogPage:** `mood` field (tech/personal/politics/tutorial/opinion/announcement/research/review), StreamField body (paragraph/image/code), tags, readtime, Libravatar avatar
- **Site settings:** `wagtail.contrib.settings` with `SiteConfigSettings`
- **Templates:** `core/templates/` (base, components) + `apps/*/templates/*/` (pages)
- **Template tags:** `wagtail_url_from_model_slug` for Svelte CE props

### Frontend (Svelte + Vite + Tailwind — heavy processing here)
- **Svelte 5** runes (`$state`, `$props`, `$derived`, `$effect`) as **custom elements**
- **django-vite** registers all assets: `{% vite_asset 'assets/...' %}`, HMR via `{% vite_hmr_client %}`
- **Tailwind CSS 4** + DaisyUI — themes: `tanstack-dark` (default) / `tanstack-light`
- **HTMX** — partial page swaps (pagination, tag filtering), `hx-push-url` for history, `hx-swap="outerHTML settle:200ms"`
- **AOS** — scroll animations (fade-up, github.blog-style), auto-refreshes after HTMX swaps
- **Mood badge** — Svelte component handles mood→color mapping (no backend logic)
- **Vite entries:** each component/icon/entry registered in `vite.config.ts` `rollupOptions.input`

### Design System
- **Ghost blog:** centered article card, generous whitespace, clean typography
- **github.blog:** colored mood badges (purple=tech, sky=personal, red=politics, etc.)
- **Sidebar TOC:** Takumi docs style — left-border rail, scroll-spy, H2/H3 nesting
- **Blog index:** MakerKit alternating rows, decorative lines, AOS fade-up on scroll
- **Color palette:** deep dark (#080809), purple primary, amber accent
- **Typography:** Inter variable font, tight heading tracking

## What to Do When...

### Adding a new page type
1. Model in `apps/*/models.py` inheriting `wagtail.models.Page`, type-hint everything
2. Define `parent_page_types`, `subpage_types`, `content_panels`
3. Template in `apps/*/templates/*/` extending `base.html`
4. Load Svelte components/icons in `{% block head %}` via `{% vite_asset %}`

### Adding a new Svelte component
1. Create in `assets/components/` with `<svelte:options customElement={...}>`
2. Register in `vite.config.ts` → `rollupOptions.input` (quote keys with hyphens: `'my-component'`)
3. Load in template `{% block head %}` with `{% vite_asset 'assets/components/X.svelte' %}`
4. Use as `<x-component></x-component>`

### Adding a new Vite entry (library, animation, etc.)
1. Create entry `.ts` file in `assets/` (e.g., `assets/lib/lib.ts`)
2. Register in `vite.config.ts` rollupOptions input
3. Load in `base.html` `{% block head %}` with `{% vite_asset %}`

### Styling
- **Tailwind classes only** — no `<style>` blocks in templates
- Reusable patterns → `@utility` in `assets/tailwind/tailwind.css`
- Dynamic styles → injected via JS (`document.createElement('style')`)
- DaisyUI tokens: `bg-base-100`, `text-primary`, `border-base-300`
- Article prose: `prose prose-invert prose-lg` with inline Tailwind overrides

### Running the project
- Backend: `uv run python manage.py runserver`
- Frontend: `npm run dev` (Vite HMR) or `npm run build`
- DB: SQLite (dev), PostgreSQL (prod)
