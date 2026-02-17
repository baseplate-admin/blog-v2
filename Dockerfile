# --- Stage 1: Frontend Build ---
FROM node:25-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# This will create the /app/static/ directory containing manifest.json and assets
RUN npm run build

# First, build the application in the `/app` directory.
# See `Dockerfile` for details.
FROM ghcr.io/astral-sh/uv:python3.14-alpine AS builder
ENV UV_COMPILE_BYTECODE=1 UV_LINK_MODE=copy

# Disable Python downloads, because we want to use the system interpreter
# across both images. If using a managed Python version, it needs to be
# copied from the build image into the final image; see `standalone.Dockerfile`
# for an example.
ENV UV_PYTHON_DOWNLOADS=0

WORKDIR /app
RUN --mount=type=cache,target=/root/.cache/uv \
    --mount=type=bind,source=uv.lock,target=uv.lock \
    --mount=type=bind,source=pyproject.toml,target=pyproject.toml \
    uv sync --frozen --no-install-project
COPY . /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen

# Then, use a final image without uv
FROM python:3.14-alpine
# It is important to use the image that matches the builder, as the path to the
# Python executable must be the same, e.g., using `python:3.11-slim-bookworm`
# will fail.

# Copy the application from the builder
COPY --from=builder --chown=app:app /app /app
COPY --from=frontend-builder /app/static /app/static

WORKDIR /app

# Place executables in the environment at the front of the path

ENV PATH="/app/.venv/bin:$PATH"

ENV DJANGO_SETTINGS_MODULE="core.settings.dev"
# Collectstatic:
# Pulls from ./static and ./public 
# into /app/staticfiles
RUN python manage.py collectstatic --noinput --clear --link

EXPOSE 8000
CMD set -xe; python manage.py migrate --noinput; uvicorn core.asgi:application
