from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-fvpfm@gr_1l8_=%cgx#hk=@*ftymg112p(a5e5m(zx!7)+rs)8"

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = ["*"]

INSTALLED_APPS += [
    "debug_toolbar",
]
MIDDLEWARE += [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
]
INTERNAL_IPS = [
    "127.0.0.1",
]
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
DJANGO_VITE = {
    "default": {
        "dev_mode": True,
    }
}

try:
    from .local import *
except ImportError:
    pass
