from django.db import models

# Create your models here.
class Song(models.Model):
    title = models.CharField(max_length=50)
    url = models.CharField(max_length=200, default='#')
    albumArt = models.CharField(max_length=200, default='#')
    artist = models.CharField(max_length=50, default="Unknown Artist")

    def __str__(self):
        return self.title+', '+self.albumArt

class Playlist(models.Model):
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    name = models.CharField(max_length=50, default='') #name of city
    songs = models.ManyToManyField(Song)

    def __str__(self):
        return str(self.lat)+', '+str(self.lng)+', '+self.name

    def latLng(self):
        return (self.lat, self.lng)
