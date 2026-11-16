"""Create a kitchen-sink showcase post that exercises every StreamField block.

Idempotent: re-running updates the existing `kitchen-sink` post instead of
duplicating it. Run with: uv run python scripts/make_showcase.py
"""
import datetime
import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.dev")
django.setup()

from wagtail.models import Page

from apps.blog.models import BlogPage

BLOG_INDEX_ID = 4  # "Blog" index page

BODY: list = [
    ("paragraph", "<p>Welcome to the <strong>block kitchen sink</strong>. This single post exercises every StreamField block this blog supports, so you can see how each one renders. Scroll through and everything you see here is a block you can drop into your own post in the Wagtail admin.</p><p>Emoji render as Twemoji graphics inline, not native OS glyphs: sparkles ✨, fire 🔥, flag 🇨🇩, thumbs up 👍🏽, and a ZWJ sequence 💑. They swap in the moment their SVG chunk loads.</p>"),
    ("aos_heading", {"text": "Writing with blocks", "level": "h2", "animation": "fade-up", "delay": "0"}),
    ("paragraph", "<p>Every piece of content on this page is a <em>block</em>. Wagtail stores them as a <code>StreamField</code>: an ordered list of named blocks, each with its own shape. The admin lets you add, reorder, and nest them without touching code, and the frontend renders each one through a matching React component.</p>"),
    ("callout", {"title": "Heads up", "body": "Callouts are great for pulling a key point out of the prose so it stands out at a glance. This one is the info variant; there are also warning, success, and error variants.", "variant": "info"}),
    ("alert", {"title": "Important note", "message": "Alerts are heavier than callouts. Use them for things the reader really must not miss, like a deprecation or a gotcha. This is the warning variant.", "variant": "warning"}),
    ("aos_highlight", {"text": "The whole point of a block-based editor is that structure and presentation are separated, so you can restyle every post in the site by changing one component.", "variant": "primary", "animation": "zoom-in", "delay": "100"}),
    ("separator", {"style": "line"}),
    ("aos_heading", {"text": "Code", "level": "h2", "animation": "fade-up", "delay": "0"}),
    ("paragraph", "<p>Code blocks are highlighted server-side with Pygments, so there is zero highlighting cost in the browser. The language, line numbers, and footer are all editable per block.</p>"),
    ("code", {"language": "python", "code": "from dataclasses import dataclass\n\n@dataclass\nclass Block:\n    name: str\n    body: dict\n\n    def render(self) -> str:\n        return f'<{self.name}>{self.body}</{self.name}>'\n\nprint(Block('h2', {'text': 'Hello'}).render())", "footer_text": "Server-side Pygments highlighting, lovelace theme."}),
    ("code", {"language": "typescript", "code": "import { createInertiaApp } from '@inertiajs/react';\n\ncreateInertiaApp({\n    resolve: (name) => import(`./pages/${name}.tsx`),\n});", "footer_text": ""}),
    ("separator", {"style": "dots"}),
    ("aos_heading", {"text": "Structured data", "level": "h2", "animation": "fade-up", "delay": "0"}),
    ("paragraph", "<p>When a value is a number or a short fact, a stats grid gives it room to breathe instead of burying it in a sentence.</p>"),
    ("stats_grid", {"stats": [{"value": "17", "label": "Block types"}, {"value": "3,689", "label": "Twemoji SVGs"}, {"value": "0", "label": "CDN requests"}, {"value": "~200 kB", "label": "Main bundle gz"}]}),
    ("card_grid", {"cards": [
        {"title": "Backend-heavy", "description": "All logic runs in Django. The frontend ships a lean bundle and renders what the server sends.", "icon": "shield"},
        {"title": "Server-rendered SEO", "description": "Meta, OG, and Twitter tags are emitted in the HTML before any JavaScript runs, so crawlers see a complete page.", "icon": "globe"},
        {"title": "Typed end to end", "description": "Full type hints in Python and TypeScript throughout, so refactors are caught at build time.", "icon": "code"},
        {"title": "Lazy by default", "description": "Mermaid and every Twemoji SVG load their own chunk only when it first appears on screen.", "icon": "lightning-bolt"},
    ]}),
    ("tabs", {"variant": "box", "tabs": [
        {"title": "Install", "content": "Run the backend with uv and the frontend with npm. Two processes in development, one in production.", "icon": "code"},
        {"title": "Run", "content": "The dev server runs webpack on port 3000 and Django on port 8000. They share the same /static/ URL space.", "icon": "lightning-bolt"},
        {"title": "Ship", "content": "npm run build emits hashed assets and webpack-stats.json. WhiteNoise serves them in production.", "icon": "shield"},
    ]}),
    ("timeline", {"compact": False, "items": [
        {"title": "Vite + HTMX", "description": "The original stack: Django templates with HTMX boosts and a Vite-built Svelte UI.", "timestamp": "2026-11-04"},
        {"title": "Inertia + Svelte", "description": "Pivoted to Inertia.js with a Svelte 5 frontend and server-rendered SEO tags.", "timestamp": "2026-11-05"},
        {"title": "React 19", "description": "Migrated the whole frontend from Svelte to React 19 and @inertiajs/react.", "timestamp": "2026-11-07"},
        {"title": "webpack", "description": "Swapped the bundler from Vite to webpack + django-webpack-loader for full control.", "timestamp": "2026-11-10"},
    ]}),
    ("steps", {"vertical": True, "active_step": 2, "steps": [
        {"title": "Add a block", "description": "Define the StructBlock in apps/blog/blocks and register it in the model."},
        {"title": "Render it", "description": "Write the matching React component and add a case in BlockRenderer."},
        {"title": "Style it", "description": "Use Tailwind utilities and the shadcn tokens; keep class names literal so the scanner picks them up."},
        {"title": "Ship it", "description": "No serializer to write - the field is auto-dumped as {type, value}."},
    ]}),
    ("tooltip", {"inner_text": "What is a StreamField?", "tooltip_text": "A Wagtail field that stores an ordered list of blocks, each with its own typed structure. It is the workhorse behind this whole page.", "placement": "top", "variant": "primary"}),
    ("aos_quote", {"quote": "The best interface is the one that lets you say what you mean and means what you say.", "attribution": "Every content editor I have ever loved", "animation": "fade-right", "delay": "0"}),
    ("separator", {"style": "space"}),
    ("aos_heading", {"text": "Diagrams", "level": "h2", "animation": "fade-up", "delay": "0"}),
    ("paragraph", "<p>Mermaid diagrams are written as text in the admin and rendered client-side only when they scroll into view, so a diagram-heavy post stays fast to load.</p>"),
    ("mermaid", {"theme": "dark", "code": "flowchart LR\n    A[StreamField] --> B[BlockRenderer]\n    B --> C{block.type}\n    C -->|paragraph| D[Paragraph]\n    C -->|code| E[Code]\n    C -->|mermaid| F[Mermaid]\n    D --> G[DOM]\n    E --> G\n    F --> G"}),
    ("paragraph", "<p>Here is a sequence diagram for the dev/prod serving split set up in the webpack migration.</p>"),
    ("mermaid", {"theme": "dark", "code": "sequenceDiagram\n    participant Browser\n    participant Django\n    participant Webpack as webpack :3000\n    Browser->>Django: GET /blog/\n    Django-->>Browser: HTML + script tag\n    Browser->>Webpack: load main.js\n    Webpack-->>Browser: bundle + CSS via style-loader"}),
    ("callout", {"title": "Try it", "body": "This post is just data in the database. Edit it in the Wagtail admin, delete blocks, reorder them, or duplicate the page to start a new one. Every block you see is reusable.", "variant": "success"}),
]

SLUG = "kitchen-sink"

blog_index = Page.objects.get(id=BLOG_INDEX_ID)
existing = BlogPage.objects.filter(slug=SLUG).first()

if existing:
    existing.body = BODY
    existing.save_revision().publish()
    page = existing
else:
    page = BlogPage(
        slug=SLUG,
        title="The kitchen sink",
        intro="Every StreamField block this blog supports, in one post - headings, code, callouts, stats, cards, tabs, timelines, steps, tooltips, quotes, and Mermaid diagrams.",
        body=BODY,
        mood="tech",
        date=datetime.datetime.now(tz=datetime.timezone.utc).date(),
    )
    blog_index.add_child(instance=page)
    page.save_revision().publish()
    page.tags.add("meta", "demo", "blocks")

print("Created/updated:", page.id, page.slug, page.get_full_url())
print("Block count:", len(BODY))
