from django.contrib import admin

from drinksapp.models import Submission

# Register your models here.

class SubmissionAdmin(admin.ModelAdmin):
	list_display = ('created_at', 'url')

admin.site.register(Submission, SubmissionAdmin)