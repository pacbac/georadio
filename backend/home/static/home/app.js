//GLOBAL VARIABLES
//window.player = music player

$(document).ready(function(){
  $("footer:not(#orig-footer)").remove()

  //$("input").click(function(){ $(this).val("")})
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

  $(document).on("mousedown", ".options", function(){
  })

  window.player = $("#music-player")
  $("button#post-song").click(() => {
    if(!$("#search-songs").val().length) return
    $.post("/postsong", {
      'name': $("#search-songs").val()
    }, data => {
      console.log("Posted data", data)
      if(data.valid != false && data.preview)
        player.attr("src", data.preview)
      else
        player.attr("src", "#")
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
  player.on("ended", () => $(".fa-play").removeClass("fa-pause"))

  /*Playlist controls*/
  $(".track").on("click", function(){
    player.attr("src", $(this).children("p").attr("src"))
    $(".selected").removeClass("selected")
    $(this).addClass("selected")
    if(!checkPlayable()) return
    play()
  })

  $(".fa-step-forward").click(function() {
    if($(".selected").is(":last-child")) return
    $(".selected").next().addClass("temp")
    $(".selected").removeClass("selected")
    $(".temp").addClass("selected")
    $(".temp").removeClass("temp")
    player.attr("src", $(".selected").children("p").attr("src"))
    if(!checkPlayable()) return
    play()
  })

  $(".fa-step-backward").click(function() {
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
    alert("Not playable")
    pause()
    return false
  }
  return true
}
