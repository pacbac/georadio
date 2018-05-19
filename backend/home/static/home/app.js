$(document).ready(function(){

  var clearSearch = e => {
    let key = e.which || e.keyCode
    if(key == 13) $("#pac-input").text("")
  }

  $("#pac-input").keypress(e => clearSearch(e))
  $(".pac-item").on("click", e => clearSearch(e))

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

  $("button#post-song").click(() => {
    $.post("/postsong", {
      'name': $("#search-songs").text()
    }, data => {
      console.log("Posted data", data)
    })
  })
})
