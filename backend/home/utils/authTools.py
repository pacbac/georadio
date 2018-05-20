import spotipy, spotipy.util as util
from .. import clientinfo as ci

def getSpotify(spotify):
    #if exists already, just return it
    if spotify: return spotify
    #else, create new spotify obj
    authObj = spotipy.oauth2.SpotifyClientCredentials(client_id=ci.client_id, client_secret=ci.client_secret)
    token = authObj.get_access_token()
    return spotipy.Spotify(auth=token)
