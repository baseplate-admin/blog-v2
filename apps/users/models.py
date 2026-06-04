
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
from django.db import models

from .manager import MyUserManager


class User(AbstractBaseUser, PermissionsMixin):
    username: models.CharField = models.CharField(max_length=150, unique=True, help_text="Required. Used for login.")
    email: models.EmailField = models.EmailField(unique=True, help_text="Required. Primary email address.")

    is_staff: models.BooleanField = models.BooleanField(default=False)
    is_active: models.BooleanField = models.BooleanField(default=True)
    date_joined: models.DateTimeField = models.DateTimeField(auto_now_add=True)

    objects: MyUserManager = MyUserManager()

    USERNAME_FIELD: str = "username"

    REQUIRED_FIELDS: list[str] = ["email"]

    def __str__(self) -> str:
        return self.username
