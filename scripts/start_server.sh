#!/bin/sh

python manage.py migrate --noinput || exit 1
python manage.py collectstatic --noinput --clear --link

uvicorn core.asgi:application --host 0.0.0.0 --port 8000