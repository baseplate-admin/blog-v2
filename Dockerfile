# --- Stage 1: Frontend Build ---
FROM node:26-alpine AS frontend-builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
# Only copy source needed for the build — rest comes from builder stage
COPY assets/ assets/
COPY public/ public/
COPY vite.config.ts tsconfig.json vite-env.d.ts ./
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
    uv sync --frozen --no-install-project --no-default-groups
COPY . /app
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-default-groups

# Then, use a final image without uv
FROM python:3.14-alpine
# It is important to use the image that matches the builder, as the path to the
# Python executable must be the same, e.g., using `python:3.11-slim-bookworm`
# will fail.

# Copy the application from the builder
COPY --from=builder --chown=app:app /app /app
COPY --from=frontend-builder /app/static /app/static

WORKDIR /app

# Remove unneeded build artifacts (assets dir not needed at runtime)
RUN rm -rf /app/assets

# Place executables in the environment at the front of the path

ENV PATH="/app/.venv/bin:$PATH"

ENV DJANGO_SETTINGS_MODULE="core.settings.production"
RUN chmod +x /app/scripts/start_server.sh
# Collectstatic:
# Pulls from ./static and ./public 
# into /app/staticfiles
RUN python manage.py collectstatic --noinput --clear --link

EXPOSE 8000
ENTRYPOINT ["/app/scripts/start_server.sh"]
