from django.db import models


# Create your models here.
class File(models.Model):
    name = models.CharField(max_length=200, blank=False, null=False)
    description = models.CharField(max_length=200, blank=False, null=False)
    contents = models.TextField(blank=False, null=False)

    def __str__(self):
        return self.name
