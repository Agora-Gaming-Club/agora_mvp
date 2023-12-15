from django.contrib import admin

# Register your models here.
from filestore.models import File


class FileAdmin(admin.ModelAdmin):
    list_display = [
        "name",
        "description",
        # "contents",
        "content",
    ]

    def content(self, obj):
        return obj.contents[:100] + "..."


admin.site.register(File, FileAdmin)
