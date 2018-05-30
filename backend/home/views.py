from django.shortcuts import render
import spotipy, spotipy.util as util
from django.http import HttpResponse
import json
from .utils import authTools, mathTools
from .models import *

RADIUS = 5

# Create your views here.
spotify = None

def index(request):
    global spotify
    spotify = authTools.getSpotify(spotify)
    results = spotify.search(q="This is America", type="track")
    context = {'playlist': []}
    for track in results['tracks']['items']:
        try:
            #print(json.dumps(trac5k, indent=2))
            imageUrl = track['album']['images'][2]['url'] if track['album']['images'][2]['url'] else "#"
            previewUrl = track['preview_url'] if track['preview_url'] else "#"
            context['playlist'].append((track['album']['name'], previewUrl, imageUrl, track['uri']))
        except:
            pass
    #print(json.dumps(track, indent=2))
    return render(request, "index.html", context)

def getPlaylist(request):
    if request.method != 'GET':
        return HttpResponse(json.dumps({'valid': False}))
    location = (float(request.GET['loc[lat]']), float(request.GET['loc[lng]']))
    playlistList = [obj for obj in Playlist.objects.all() if mathTools.calcDist(obj.latLng(), location) < RADIUS]
    playlist = [] if not len(playlistList) else playlistList #playlist is empty if no playlists found, else return valid playlist
    return HttpResponse(json.dumps({'valid': True, 'location': location, 'playlist': playlist}))

def postsong(request):
    if request.method != 'POST':
        return HttpResponse(json.dumps({'valid': False}))

    global spotify
    spotify = authTools.getSpotify(spotify)
    results = spotify.search(q=request.POST['name'], type="track")
    location = (float(request.POST['loc[lat]']), float(request.POST['loc[lng]']))
    try:
        track = results['tracks']['items'][0] #get first track of the search results (probably best suggestion)
    except:
        return HttpResponse(json.dumps({'valid': False}))
    try:
        title = track['album']['name']
        url = track['preview_url'] if track['preview_url'] else "#"
        albumArt = track['album']['images'][2]['url'] if track['album']['images'][2]['url'] else "#"
    except:
        return HttpResponse(json.dumps({'valid': False}))

    dbSongs = Song.objects.filter(title=title, url=url)
    if not dbSongs.exists(): #if doesn't already exist, add to database
        song = Song(title=title, url=url, albumArt=albumArt)
        print(' '.join(song.__str__()))
        song.save()
    else: #else if it exists, get existing song
        song = dbSongs.first()

    #get playlists within a 5 mile radius
    playlistList = [obj for obj in Playlist.objects.all() if mathTools.calcDist(obj.latLng(), location) < RADIUS]
    minPlaylist = None
    #find playlist with smallest distance from location
    if len(playlistList):
        minPlaylist = playlistList[0]
        minDist = mathTools.calcDist(minPlaylist.latLng(), location)
        for elem in playlistList:
            dist = mathTools.calcDist(elem.latLng(), location)
            if dist < minDist:
                minPlaylist = elem
                minDist = dist
    else: #no such playlist, we will make a new one
        minPlaylist = Playlist(lat=location[0], lng=location[1], name=title)
        print(minPlaylist)
        minPlaylist.save()

    if not PlaylistSongs.objects.filter(playlist=minPlaylist, song=song).exists():
        playlistSong = PlaylistSongs()
        playlistSong.save()
        playlistSong.playlist.add(minPlaylist)
        playlistSong.song.add(song)

    return HttpResponse(json.dumps({'valid': True,
    'name': title,
    'preview': url,
    'image': albumArt}), content_type="application/json")

def wrapCalcDist(playlist):
    return
