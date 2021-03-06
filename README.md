# GeoRadio

GeoRadio is a web application that allows you to pin music tracks onto a map so that you can listen to songs that you and others nearby are listening to. This allows the user to get a feel of what the music is like at any given location. This application aims to bring communities all over the world together through music. If someone from Hong Kong, for instance, posted a track at their location, the application is intended so that others around the world may also see it if they wanted to listen to music posted by users from Hong Kong.

## Getting Started

1. Clone the repository onto your preferred local directory
2. We'll continue to set up the application in the next steps.

### Prerequisites and Installation

- Python 3.x (and set the environment PATH variable on your machine so the python command works in shell as well)
- pip (latest version here, follow instructions: https://pip.pypa.io/en/stable/installing/)
- Set up a ```.env``` file with the following values so your custom settings for the repo will work:
  ```
    USERNAME=123395859
    CLIENT_ID=[[Spotify premium account ID]]
    CLIENT_SECRET=[[Spotify premium account secret key]]
    SECRET_KEY=Django secret key can be generated here: https://www.miniwebtool.com/django-secret-key-generator/
    MAPS_KEY=[[Google Maps API key]]
  ```
 - Run ```pip install -r requirements.txt``` to install all dependencies

### Running

1. Run ```python manage.py runserver```
4. Use your browser to go to the address the app is being hosted on (usually ```localhost:8000```)

### Usage

- Allowing the app to access your geolocation will automatically position the map to your location and attempt to retrieve any songs previously posted there. Otherwise, it will default to Washington, D.C.
- The audio being played is a 30-second preview of the song from Spotify. Some tracks may not have an audio track to go along with it, and when tried to be played, it will turn red and become skipped over.
- To post a song, type in a song into the smaller search bar and click search. Suggestions should pop up. Clicking on a suggestion will then add the song to the location.
- Typing in a different location into the maps search bar will automatically load the corresponding music playlist to that new location
- **Note: A lot of tracks do not have preview URLs. The other alternative would be using the app as a remote for your Spotify account to play full songs, which is not supported (yet)**

Locations that already have sample songs for you to try out:
- UCLA
- Washington DC
- Beijing, China
- Hong Kong

## Built With

* Python Django
* Your standard HTML/CSS/JS/jQuery
* Spotify API
* Google Maps API
* Spotipy (Spotify API wrapper for Python)
* SQLite 3

## Authors

* **Clayton Chu** - [pacbac](https://github.com/pacbac)
* **Evan Yang** - [evanyang1](https://github.com/evanyang1)
* **Zachary Prong** - [zprong](https://github.com/zprong)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

Prof. Revaz Dzhanidze for the CS M117 project
