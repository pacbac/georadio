import spotipy, spotipy.util as util
from .. import clientinfo as ci

def getSpotify(spotify):
    authObj = spotipy.oauth2.SpotifyClientCredentials(client_id=ci.client_id, client_secret=ci.client_secret)
    token = authObj.get_access_token()
    return spotipy.Spotify(auth=token)
