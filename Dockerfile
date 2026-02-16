# --- Stage 1: Frontend Build ---
FROM node:25-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
# This will create the /app/static/ directory containing manifest.json and assets
RUN npm run build

# --- Stage 2: Python Builder (uv) ---
FROM ghcr.io/astral-sh/uv:python3.14-alpine AS python-builder
WORKDIR /app
# Minimal build deps for Pillow/Postgres (No MariaDB)
RUN apk add --no-cache build-base jpeg-dev zlib-dev libwebp-dev

RUN --mount=type=bind \
    uv venv /opt/venv && \
    uv sync

# --- Stage 3: Final Runtime ---
FROM python:3.14-alpine
WORKDIR /app

# Runtime libraries
RUN apk add --no-cache libpq libjpeg-turbo zlib libwebp && adduser -D wagtail

COPY --from=python-builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH" \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PORT=8000

# 1. Copy the Django project code
COPY . .

# 2. Link Vite Assets:
# Copy the built 'static' folder from Node stage to the 'static' folder in Python stage
# This ensures manifest.json and compiled JS/CSS are where django-vite expects them.
COPY --from=frontend-builder /app/static ./static

RUN chown -R wagtail:wagtail /app
USER wagtail

# 3. Collectstatic:
# Pulls from ./static and ./public 
# into /app/staticfiles
RUN python manage.py collectstatic --noinput --clear --link

EXPOSE 8000
CMD set -xe; python manage.py migrate --noinput; uvicorn core.asgi:application