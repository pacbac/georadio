from django.shortcuts import render
import spotipy, spotipy.util as util
from django.http import HttpResponse
import json
from .utils import authTools

# Create your views here.
spotify = None

def index(request):
    #scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
    global spotify
    spotify = authTools.getSpotify(spotify)
    results = spotify.search(q="This is America", type="track")
    try:
        track = results['tracks']['items'][0] #get first track of the search results (probably best suggestion)
        context = {
            'playlist': [
                (track['album']['name'], track['preview_url'], track['uri'])
            ]
        }
    except:
        context = {'playlist': []}
    #print(json.dumps(track, indent=2))
    return render(request, "index.html", context)

def postsong(request):
    global spotify
    if request.method == 'POST':
        spotify = authTools.getSpotify(spotify)
        results = spotify.search(q=request.POST['name'], type="track")
        print(results['tracks'])
        try:
            track = results['tracks']['items'][0] #get first track of the search results (probably best suggestion)
        except:
            print("Error: Cannot retrieve track")
            return
        try:
            return HttpResponse(json.dumps({'valid': True,
            'name': track['album']['name'],
            'preview': track['preview_url']}), content_type="application/json")
        except:
            return HttpResponse(json.dumps({'valid': False}))
    return HttpResponseForbidden()
