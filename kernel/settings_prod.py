"""
Prod Settings file:

Remember to set Env variable: "DJANGO_SETTINGS_MODULE" to "kernel.settings_prod" to enable it.
"""
import os
from pathlib import Path

from .settings import *

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.mysql",
        "NAME": os.environ.get("DB_NAME"),
        "USER": os.environ.get("DB_USERNAME"),
        "PASSWORD": os.environ.get("DB_PASSWORD"),
        "HOST": os.environ.get("DB_HOST"),
        "PORT": os.environ.get("DB_PORT"),
    }
}

DJANGO_VITE_DEV_MODE = False
EMAIL_ENABLED = True
SITE_ROOT = "https://??.agoragaming.gg"
DEBUG = False
