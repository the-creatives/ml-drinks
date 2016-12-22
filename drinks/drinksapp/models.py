from __future__ import unicode_literals

from django.db import models

# Create your models here.
class Submission(models.Model):
	created_at = models.DateTimeField(auto_now_add=True)
	url = models.CharField(max_length=1000)