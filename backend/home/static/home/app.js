$(document).ready(function(){

  var clearSearch = e => {
    let key = e.which || e.keyCode
    if(key == 13) $("#pac-input").text("")
  }

  $("#pac-input").keypress(e => clearSearch(e))

  $(".pac-item").on("click", e => clearSearch(e))

  $(document).on("mousedown", ".options", function(){
  })
})
