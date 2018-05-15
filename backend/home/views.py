from django.shortcuts import render
import spotipy, spotipy.util as util
from . import clientinfo as ci
from django.http import HttpResponse
import json

# Create your views here.
def index(request):
    scope = 'user-read-playback-state user-modify-playback-state user-read-currently-playing'
    authObj = spotipy.oauth2.SpotifyClientCredentials(client_id=ci.client_id, client_secret=ci.client_secret)
    try:
        token = authObj.get_access_token()
    except spotipy.oauth2.SpotifyOauthError:
        token = new_token()
    spotify = spotipy.Spotify(auth=token)
    results = spotify.search(q="This is America", type="track")
    print(json.dumps(results['tracks']['items'][0], indent=2))
    return render(request, "index.html", {'playlist': results['tracks']['items'][0]['album']['name']})

def callback(request):
    return HttpResponse("done")
