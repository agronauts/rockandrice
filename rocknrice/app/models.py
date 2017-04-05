from django.db import models

class Crags(models.Model):
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=2500)

    def __str__(self):
        return self.title
