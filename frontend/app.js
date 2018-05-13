$(document).ready(function(){

  $("#pac-input").keypress(e => {
    let key = e.which || e.keyCode
    if(key != 13) return
  })

  $(document).on("mousedown", ".options", function(){
  })
})
