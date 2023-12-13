from django.contrib import admin

# Register your models here.
from filestore.models import File


class FileAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "description",
        "contents",
    ]


admin.site.register(File, FileAdmin)
