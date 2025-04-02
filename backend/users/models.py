from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    # Add any additional fields you want here
    # For example, you might want to add a profile picture or bio
    # profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    # bio = models.TextField(blank=True, null=True)
    pass