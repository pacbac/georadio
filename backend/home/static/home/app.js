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

  $("button#post-song").click(() => {
    if(!$("#search-songs").val().length) return
    $.post("/postsong", {'name': $("#search-songs").val()}, data => {
      console.log("Posted data", data)
      //if data is valid and preview url is available, set player to player to play preview url
      //if invalid or preview url unavailable, dead link is used (not playable)
      if(!data.valid || !data.name) {
        alert("Unable to post to server.")
        return
      }
      let src = (data.preview) ? data.preview : "#"
      let image = (data.image) ? data.image : defaultAlbumImg
      $(".song-list").append(`<div class="track">
        <p src="${src}">${data.name}</p>
        <img src="${image}" width=50 height=50>
      </div>`)
      pause()
    })
    $("button#post-song").val("")
  })

  $("button#post-song").ajaxError(() => {
    //make something about like can't post song...
  })

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
  if($(".selected").is(":last-child")) return
  $(".selected").next().addClass("temp")
  $(".selected").removeClass("selected")
  $(".temp").addClass("selected")
  $(".temp").removeClass("temp")
  player.attr("src", $(".selected").children("p").attr("src"))
  if(!checkPlayable()) return
  play()
}
