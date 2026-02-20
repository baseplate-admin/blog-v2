from django.db import models

from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
)

from .manager import MyUserManager


class User(AbstractBaseUser, PermissionsMixin):
    username = models.CharField(max_length=150, unique=True)
    email = models.EmailField(unique=True)

    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = MyUserManager()

    USERNAME_FIELD = "username"

    REQUIRED_FIELDS = ["email"]

    def __str__(self):
        return self.username
