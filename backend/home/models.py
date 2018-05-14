from django.db import models

# Create your models here.
class Playlist(models.Model):
    lat = models.FloatField(null=True, blank=True, default=None)
    lng = models.FloatField(null=True, blank=True, default=None)

#class Song(models.model):
