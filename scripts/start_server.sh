#!/bin/bash

python manage.py migrate --noinput
python manage.py collectstatic --noinput --clear --link

granian --interface wsgi core.wsgi:application