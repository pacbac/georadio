from django.db import models

# Create your models here.
class Playlist(models.Model):
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    name = models.CharField(max_length=50)

    def __str__(self):
        return (self.name, self.lat, self.lng)

class Song(models.Model):
    title = models.CharField(max_length=50)
    url = models.CharField(max_length=200)

    def __str__(self):
        return (self.title, self.url)

class PlaylistSongs(models.Model):
    playlist = models.ManyToManyField(Playlist)
    song = models.ManyToManyField(Song)

    def __str__(self):
        return (self.playlist, self.song)
