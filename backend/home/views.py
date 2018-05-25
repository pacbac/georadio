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
    playlist = [obj for obj in Playlist.objects.all() if mathTools.calcDist(obj.latLng(), location) < RADIUS]
    return HttpResponse(json.dumps({'valid': True, 'location': location, 'playlist': playlist}))

def postsong(request):
    if request.method != 'POST':
        return HttpResponse(json.dumps({'valid': False}))

    global spotify
    spotify = authTools.getSpotify(spotify)
    results = spotify.search(q=request.POST['name'], type="track")
    try:
        track = results['tracks']['items'][0] #get first track of the search results (probably best suggestion)
    except:
        return HttpResponse(json.dumps({'valid': False}))
    try:
        return HttpResponse(json.dumps({'valid': True,
        'name': track['album']['name'],
        'preview': track['preview_url'],
        'image': track['album']['images'][2]['url']}), content_type="application/json")
    except:
        return HttpResponse(json.dumps({'valid': False}))
