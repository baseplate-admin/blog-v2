#!/bin/bash

RUN python manage.py collectstatic --noinput --clear --link

granian --interface wsgi core.wsgi:application