from django.shortcuts import render
import spotipy, spotipy.util as util
from django.http import HttpResponse
import json
from .utils import authTools, mathTools
from .models import *
from django.views.decorators.csrf import ensure_csrf_cookie

RADIUS = 5
DEFAULTLOC = (38.9072, -77.0369) #Wash DC lat/long by default

spotify = None

@ensure_csrf_cookie
def index(request):
    location = DEFAULTLOC
    context = {'playlist': findPlaylist(location)}
    return render(request, "index.html", context)

def getPlaylist(request):
    if request.method != 'GET':
        return HttpResponse(json.dumps({'valid': False}))
    location = (float(request.GET['loc[lat]']), float(request.GET['loc[lng]']))
    playlist = findPlaylist(location)
    return HttpResponse(json.dumps({'valid': True, 'location': location, 'playlist': playlist}))

def postsong(request):
    if request.method != 'POST':
        return HttpResponse(json.dumps({'valid': False}))

    global spotify
    spotify = authTools.getSpotify(spotify)
    results = spotify.search(q=request.POST['name'], type="track")
    location = (float(request.POST['loc[lat]']), float(request.POST['loc[lng]']))
    try:
        track = results['tracks']['items'][int(request.POST['index'])] #get first track of the search results (probably best suggestion)
    except:
        return HttpResponse(json.dumps({'valid': False}))
    try:
        title = track['name'] if track['name'] else "Unknown title"
        url = track['preview_url'] if track['preview_url'] else "#"
        albumArt = track['album']['images'][2]['url'] if track['album']['images'][2]['url'] else "#"
        artist = track['artists'][0]['name'] if track['artists'][0]['name'] else "Unknown artist"
    except:
        return HttpResponse(json.dumps({'valid': False}))

    dbSongs = Song.objects.filter(title=title, url=url)
    if not dbSongs.exists(): #if doesn't already exist, add to database
        song = Song(title=title, url=url, albumArt=albumArt, artist=artist)
        #print(' '.join(song.__str__()))
        song.save()
    else: #else if it exists, get existing song
        song = dbSongs.first()

    #get playlists within a 5 mile radius
    playlistList = [obj for obj in Playlist.objects.all() if mathTools.calcDist(obj.latLng(), location) < RADIUS]
    minPlaylist = None
    #find playlist w/ min distance from location
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
        minPlaylist.save()

    if not checkDuplicates(minPlaylist, song): #don't add duplicate songs to the same playlist
        minPlaylist.songs.add(song)
    else:
        return HttpResponse(json.dumps({'valid': False}))

    return HttpResponse(json.dumps({'valid': True,
    'name': title,
    'preview': url,
    'image': albumArt,
    'artist': artist}), content_type="application/json")

def findPlaylist(loc):
    location = (loc[0], loc[1])
    playlistList = [obj for obj in Playlist.objects.all() if mathTools.calcDist(obj.latLng(), loc) < RADIUS]
    #playlist is empty if no playlists found, else return valid playlist
    if len(playlistList):
        playlist = []
        for track in playlistList[0].songs.all():
            playlist.append((track.title, track.url, track.albumArt, track.artist))
        return playlist
    else:
        return []

def checkDuplicates(playlist, song):
    for dataSong in playlist.songs.all():
        if(str(dataSong) == str(song)):
            return True
    return False

def searchSong(request):
    if request.method != 'GET':
        return HttpResponse(json.dumps({'valid': False}))

    global spotify
    spotify = authTools.getSpotify(spotify)
    results = spotify.search(q=request.GET['name'], type="track", limit=6)
    return HttpResponse(json.dumps({'valid': True, 'results': results}))
