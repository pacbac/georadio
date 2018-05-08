var key = 'AIzaSyAhQfMo_WF9YjXqjv8OJhjDRGsNtS2ADMU'
var map, currentLocation
var markerIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'


$(document).ready(function(){
  $("#pac-input").keypress(e => {
    let key = e.which || e.keyCode
    if(key != 13) return
  })

  $(document).on("mousedown", ".options", function(){
  })
})

function initAutocomplete(currentloc) {
  $("#map").text("")

  var mapOptions = {
    zoom: 14,
    center: currentloc
  }

  map = new google.maps.Map(document.getElementById('map'), mapOptions);
  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', () => searchBox.setBounds(map.getBounds()));

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    //debugger
    var places = searchBox.getPlaces();
    if (places.length == 0) return
    let place = places[0]

    currentLocation = { lat: place.geometry.location.lat(), lng: place.geometry.location.lng() }

    var startIcon = {
      url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    marker = new google.maps.Marker({
      map,
      icon: startIcon,
      title: 'Starting location',
      position: currentLocation
    })

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    if (place.geometry.viewport)
      bounds.union(place.geometry.viewport);
    else
      bounds.extend(place.geometry.location);
    map.fitBounds(bounds);
  });
}

// Try HTML5 geolocation.
function locate(){
	if ("geolocation" in navigator){
    navigator.geolocation.getCurrentPosition(position => {
      let lat = position.coords.latitude;
      let lng = position.coords.longitude;
      currentLocation = { lat, lng };
      initAutocomplete(currentLocation);
	  }, err => console.log("error", JSON.stringify(err)));

	}
}
