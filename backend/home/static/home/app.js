//GLOBAL VARIABLES
//window.player = music player
const defaultAlbumImg = "https://d2qqvwdwi4u972.cloudfront.net/static/img/default_album.png"

$(document).ready(function(){
  window.player = $("#music-player")
  $("footer:not(#orig-footer)").remove()

  /* CSRF Handling*/
  $.ajaxSetup({
     beforeSend: function(xhr, settings) {
         function getCookie(name) {
             var cookieValue = null;
             if (document.cookie && document.cookie != '') {
                 var cookies = document.cookie.split(';');
                 for (var i = 0; i < cookies.length; i++) {
                     var cookie = jQuery.trim(cookies[i]);
                     // Does this cookie string begin with the name we want?
                     if (cookie.substring(0, name.length + 1) == (name + '=')) {
                         cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                         break;
                     }
                 }
             }
             return cookieValue;
         }
         if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
             // Only send the token to relative URLs i.e. locally.
             xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
         }
     }
   });

   $("button#search-song").click(searchSong)
   $("input#search-songs").keypress(e => {
     let key = e.which || e.keyCode
     if(key == 13) searchSong()
   })


  $(document).on("click", ".suggested-track", function() { //click on suggestion
    $.post("/postsong", {
      'name': searchQuery, //the query was saved the moment the "search" button was pressed
      'index': parseInt(this.id), //id is the index of the song in the results list
      loc: currentLocation
    }, data => {
      //if data is valid and preview url is available, set player to player to play preview url
      //if invalid or preview url unavailable, dead link is used (not playable)
      if(!data.valid || !data.name) {
        alert("Unable to add song.")
        return
      }
      let src = (data.preview) ? data.preview : "#"
      let image = (data.image) ? data.image : defaultAlbumImg
      if($(".no-songs").length || $(".song-error").length) $(".song-list").html("")
      $(".song-list").append(`<div class="track">
        <p src="${src}">${data.name}<span class="artist"> - ${data.artist}</span></p>
        <img src="${image}" width=50 height=50>
      </div>`)
      pause()
      $(".suggestions").html("")
    }).fail(() => alert('Error: Could not post song'))
    $("button#post-song").val("")
  })

  $(document).on("click", ":not(.suggestions)", () => $(".suggestions").html(""))

  /*Audio controls*/
  $(".fa-play").click(() => {
    if(!checkPlayable()) return
    if(player[0].canPlayType && player[0].paused) play()
    else pause()
  })
  player.on("ended", nextSong)

  /*Playlist controls*/
  $(document).on("click", ".track", function(){
    player.attr("src", $(this).children("p").attr("src"))
    $(".selected").removeClass("selected")
    $(this).addClass("selected")
    if(!checkPlayable()) {
      alert("Error: Song not playable")
      return
    }
    play()
  })

  $(".fa-step-forward").click(nextSong)

  $(".fa-step-backward").click(() => {
    if($(".selected").is(":first-child")) return
    $(".selected").prev().addClass("temp")
    $(".selected").removeClass("selected")
    $(".temp").addClass("selected")
    $(".temp").removeClass("temp")
    player.attr("src", $(".selected").children("p").attr("src"))
    if(!checkPlayable()) return
    play()
  })
})

function pause(){
  player[0].pause()
  $(".fa-play").removeClass("fa-pause")
}

function play(){
  player[0].play()
  $(".fa-play").addClass("fa-pause")
}

function checkPlayable(){
  if(player.attr("src") == "#"){
    $(".selected").css("background-color", "#ffcccc")
    nextSong()
    return false
  }
  return true
}

function nextSong(){
  if($(".selected").is(":last-child")) {
    $(".selected").removeClass("selected")
    pause()
    return
  }
  $(".selected").next().addClass("temp")
  $(".selected").removeClass("selected")
  $(".temp").addClass("selected")
  $(".temp").removeClass("temp")
  player.attr("src", $(".selected").children("p").attr("src"))
  if(!$(".selected").length || !checkPlayable()) return
  play()
}

function searchSong(){
    if(!$("#search-songs").val().length) return
    $(".suggestions").html("")
    window.searchQuery = $("#search-songs").val()
    $.get("/searchsong", {'name': $("#search-songs").val()}, data => {
      data = JSON.parse(data)
      //console.log(data)
      data.results.tracks.items.forEach((elem, index) => {
        $(".suggestions").append(`<div class="suggested-track" id="${index}">
          <p src="${elem.preview_url}">${elem.name}<span class="artist"> - ${elem.artists[0].name}</span></p>
          <img src="${elem.album.images[2].url}" width=40 height=40>
        </div>`)
      })
    })
}
