import spotipy, spotipy.util as util
from decouple import config

def getSpotify(spotify):
    authObj = spotipy.oauth2.SpotifyClientCredentials(client_id=config('CLIENT_ID'), client_secret=config('CLIENT_SECRET'))
    token = authObj.get_access_token()
    return spotipy.Spotify(auth=token)
