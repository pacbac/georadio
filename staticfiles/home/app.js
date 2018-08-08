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
      if(data.preview)
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
  $(".fa-play").on("click", () => {
    if(player.attr("src") == "#"){
      alert("Not playable")
      return
    }
    if(player[0].canPlayType && player[0].paused) play()
    else pause()
  })
  player.on("ended", () => $(".fa-play").removeClass("fa-pause"))
})

function pause(){
  player[0].pause()
  $(".fa-play").removeClass("fa-pause")
}

function play(){
  player[0].play()
  $(".fa-play").addClass("fa-pause")
}
