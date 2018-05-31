from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('postsong', views.postsong, name="postsong"),
    path('playlist', views.getPlaylist, name="playlist"),
    path('searchsong', views.searchSong, name="searchsong")
]
