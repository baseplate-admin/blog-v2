#!/bin/sh

python manage.py migrate --noinput || exit 1

uvicorn core.asgi:application --host 0.0.0.0 --port 8000