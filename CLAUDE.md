# CLAUDE.md

## Project Overview

A hyper-modern personal blog powered by **Wagtail CMS** covering technology, personal life, and politics. Built with a dark-first aesthetic inspired by Ghost blog, MakerKit comparison articles, and modern documentation sidebars (Takumi docs style).

**Tech Stack:** Django + Wagtail 7.3 | Svelte 5 (custom elements) | Vite 7 | Tailwind CSS 4 + DaisyUI | HTMX (planned for navigation) | django-vite 3.1

## Project Structure

```
blog/
├── core/
│   ├── settings/
│   │   ├── base.py          # All Django/Wagtail settings (apps, middleware, templates, Wagtail config)
│   │   ├── dev.py           # Dev overrides
│   │   └── production.py    # Production overrides
│   ├── templates/
│   │   ├── base.html        # Root template: django-vite assets, wagtailuserbar, theme
│   │   ├── components/
│   │   │   ├── navbar.html  # Renders <custom-navbar> Svelte CE + passes Wagtail URLs via attributes
│   │   │   └── footer.html  # DaisyUI footer with site settings (copyright, license)
│   │   ├── 404.html / 500.html
│   │   └── search/search.html
│   ├── urls.py              # Wagtail pages, admin, search, sitemap, static/media
│   └── templates/
├── apps/
│   ├── blog/
│   │   ├── models.py        # BlogIndexPage (pagination, tag filter), BlogPage (StreamField body, readtime, avatar)
│   │   ├── templates/blog/
│   │   │   ├── blog_index_page.html  # Alternating image/text layout, tag filters, pagination
│   │   │   └── blog_page.html        # Article card, TOC sidebar, prose-styled content, mobile TOC modal
│   ├── home/
│   │   ├── models.py        # HomePage (max_count=1, hero, latest posts count, featured projects)
│   │   ├── blocks.py        # CTABlock (StructBlock: text + url)
│   │   └── templates/home/home_page.html  # Hero, latest posts grid, featured projects
│   ├── projects/
│   │   ├── models.py        # ProjectIndexPage, ProjectPage (description, github/demo URLs, featured flag, image)
│   ├── tags/
│   │   └── templatetags/wagtail_tags.py  # wagtail_url_from_model_slug tag for Svelte CE props
│   ├── site_settings/
│   │   ├── models.py        # SiteConfigSettings (site name, copyright years, license type)
│   │   └── validators.py
│   └── users/
│       ├── models.py        # Custom User (username, email, is_staff, is_active)
│       └── manager.py
├── assets/
│   ├── vite.ts              # Vite bootstrap polyfill for django-vite
│   ├── components/
│   │   ├── Navbar.svelte    # <custom-navbar> - responsive nav, theme toggle (tanstack-dark/light), mobile popover
│   │   └── TableOfContents.svelte  # <table-of-contents> - scroll-spy, IntersectionObserver, smooth scroll
│   ├── icons/               # Svelte icon components (X, RightArrow, Calendar, Eye, Circle, TOC)
│   ├── tailwind/
│   │   ├── tailwind.css     # Tailwind 4 + DaisyUI themes (tanstack-dark, tanstack-light), Inter font
│   │   └── tailwind.ts      # Tailwind entry point
│   ├── fonts/inter/         # Inter variable font + SCSS
│   ├── twemoji/             # Twemoji integration
│   └── functions/props.ts   # normalizeProps helper for CE attribute → prop conversion
├── search/                  # Wagtail search view + template
├── static/                  # Dev static files + Vite build output
├── public/                  # Public assets served directly
├── media/                   # User-uploaded images, documents
├── db.sqlite3               # Dev database
└── pyproject.toml           # Python deps: wagtail, django-vite, wagtailcodeblock, readtime, whitenoise, psycopg
```

## Key Conventions

### Django/Wagtail
- **Custom user model:** `apps.users.User` (USERNAME_FIELD = "username", required: email)
- **Page hierarchy:** Root → HomePage (max_count=1) → BlogIndexPage / ProjectIndexPage
- **BlogPage body:** StreamField with `paragraph` (RichText), `image` (ImageChooser), `code` (CodeBlock from wagtailcodeblock)
- **Tags:** ClusterTaggableManager through `BlogPageTag`
- **Reading time:** Calculated from paragraph + code block text via `readtime` library
- **Author avatar:** Libravatar based on owner's email SHA256 hash
- **Site settings:** `wagtail.contrib.settings` with `SiteConfigSettings` for copyright, license, site name
- **Templates live in:** `core/templates/` (base, components) and `apps/*/templates/*/` (page templates)
- **Template tags:** custom `wagtail_url_from_model_slug` to resolve Wagtail page URLs for Svelte custom element props

### Frontend (Svelte + Vite + Tailwind)
- **Svelte 5** with runes (`$state`, `$props`, `$derived`, `$effect`) — run as **custom elements** (`<customElement>` in svelte:options)
- **django-vite** registers all JS/CSS/assets: `{% vite_asset 'assets/...' %}` in templates, HMR via `{% vite_hmr_client %}`
- **Tailwind CSS 4** with DaisyUI — two themes: `tanstack-dark` (default, deep purple/slate) and `tanstack-light`
- **Theme toggle:** Navbar Svelte component switches `data-theme` attribute on `<html>`, persists to localStorage
- **@tailwindcss/typography** powers the `prose` classes on blog article content
- **Vite config:** multiple entry points (tailwind, inter font, twemoji, navbar, TOC, individual icons)
- **Icon components:** built as Svelte custom elements registered through vite rollupOptions input

### Design System (from references)
- **Ghost blog inspired:** centered article card, generous whitespace, clean typography, dark-first
- **Sidebar TOC:** Takumi docs style — left-border rail with active section highlight, nested indentation for H2/H3, scroll-spy via IntersectionObserver
- **Blog index:** MakerKit comparison style — alternating image/text rows, decorative vertical lines, connecting dividers, meta badges (date, read-time)
- **Article page:** single centered card (`max-w-6xl`, `bg-base-200`), header with tags → title → meta, cover image, author bar, prose content, left TOC sidebar (desktop), floating TOC button + modal (mobile)
- **Color palette:** deep dark bases (#080809, #111114), vibrant purple primary, warm amber accent, subtle borders
- **Typography:** Inter variable font, tight tracking on headings, relaxed line-height on body prose

## What to Do When...

### Adding a new page type
1. Create model in appropriate `apps/*/models.py` inheriting from `wagtail.models.Page`
2. Define `parent_page_types`, `subpage_types`, `content_panels`
3. Create template in `apps/*/templates/*/` extending `base.html`
4. Load `{% load django_vite wagtail_tags %}` in template head for any Svelte components/icons

### Adding a new Svelte component
1. Create in `assets/components/` or `assets/icons/` with `<svelte:options customElement={...}>`
2. Register entry in `vite.config.ts` → `rollupOptions.input`
3. Load in template with `{% vite_asset 'assets/components/YourComponent.svelte' %}`
4. Use as custom element: `<your-component></your-component>`

### Adding a new icon
1. Create Svelte component in `assets/icons/` as custom element
2. Register in `vite.config.ts` rollupOptions input
3. Load in template `{% block head %}` with `{% vite_asset %}`
4. Use inline: `<icon-name></icon-name>`

### Styling
- Use Tailwind utility classes directly in templates and Svelte components
- Theme colors via DaisyUI tokens: `bg-base-100`, `text-primary`, `border-base-300`, etc.
- Article content uses `prose prose-invert prose-lg` with custom overrides for headings, links, code
- Custom CSS only in `{% block head %}` `<style>` tags for things Tailwind can't express (grid backgrounds, animations)

### HTMX Navigation (planned)
- HTMX should be integrated for partial page swaps on navigation (blog index pagination, tag filtering, article navigation)
- Target the main content area, keep navbar/footer persistent
- Use `hx-push-url="true"` for browser history, `hx-target` on a content wrapper
- Swap strategies: `hx-swap="outerHTML"` or `innerHTML` depending on structure
- Maintain smooth transitions with CSS, not full page reloads

### Running the project
- Python: `uv run python manage.py runserver` (managed by uv, see pyproject.toml)
- Frontend: `npm run dev` (Vite dev server with HMR) or `npm run build` for production
- Database: SQLite in dev, PostgreSQL in production (psycopg[binary])
