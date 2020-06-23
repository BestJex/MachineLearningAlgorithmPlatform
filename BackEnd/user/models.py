from django.contrib.auth.models import AbstractUser
from django.db import models


__all__ = ["Account"]


class Account(AbstractUser):
	"""用户"""
	avatar = models.ImageField(upload_to='avatars/', default='avatars/default.png')
	telephone = models.CharField(max_length=11, null=True, blank=True, unique=True)

	def __str__(self):
		return self.username
