# The Tinkerer

A personal blog built with Django, Wagtail, Inertia.js, React 19, and webpack.

Content is edited in the Wagtail admin. Pages are rendered through Inertia with server-dumped props, so React pages receive the model fields and view context directly.

## Requirements

- Python 3.15
- Node.js 26
- uv
- Redis (production)
- PostgreSQL (production)

## Development

Install backend and frontend dependencies:

```bash
uv sync
npm install --include=dev
```

Run Django on port 8000:

```bash
uv run python manage.py runserver
```

Run the webpack dev server on port 3000 in a second terminal:

```bash
npm run dev
```

Django renders bundle tags pointing at `http://localhost:3000/static/` in development, so the page hydrates from the dev server with HMR.

## Production

```bash
npm run build
uv run python manage.py collectstatic --noinput
```

The build emits hashed assets in `static/` plus `webpack-stats.json`. WhiteNoise serves the collected files from `staticfiles/`.

Required environment variables are documented in `.env.sample`.

## Checks

```bash
npx tsc --noEmit
ruff check .
uv run python manage.py check
uv run python manage.py makemigrations --check --dry-run
uv run python manage.py test
npm run build
```

See `CLAUDE.md` for the project conventions and architecture.
