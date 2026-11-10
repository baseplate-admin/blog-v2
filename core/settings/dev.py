from .base import *

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-fvpfm@gr_1l8_=%cgx#hk=@*ftymg112p(a5e5m(zx!7)+rs)8"

# SECURITY WARNING: define the correct hosts in production!
ALLOWED_HOSTS = [
    "localhost",
    "127.0.0.1",
    "*.localhost",
]

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
# django-webpack-loader: dev mode polls webpack-stats.json (written by the
# webpack dev server on :5173) so the bundle tags point at the live dev URL.
WEBPACK_LOADER = {
    "DEFAULT": {
        "BUNDLE_DIR_NAME": "assets/",
        "STATS_FILE": BASE_DIR / "webpack-stats.json",
        "CACHE": False,
        "POLL_INTERVAL": 0.1,
    }
}
# Database
# https://docs.djangoproject.com/en/6.0/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

WAGTAILADMIN_BASE_URL = "http://localhost:8000"


from contextlib import suppress

with suppress(ImportError):
    from .local import *  # pyrefly: ignore[missing-import]
