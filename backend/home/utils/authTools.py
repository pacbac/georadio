import spotipy, spotipy.util as util
from .. import clientinfo as ci

def getSpotify(spotify):
    if spotify: return
    authObj = spotipy.oauth2.SpotifyClientCredentials(client_id=ci.client_id, client_secret=ci.client_secret)
    try:
        token = authObj.get_access_token()
    except spotipy.oauth2.SpotifyOauthError:
        token = new_token()
    return spotipy.Spotify(auth=token)
