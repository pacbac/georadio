var key = 'AIzaSyAhQfMo_WF9YjXqjv8OJhjDRGsNtS2ADMU'
var markerIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'

function initAutocomplete() {
  navigator.geolocation.getCurrentPosition(position => {
    let lat = position.coords.latitude
    let lng = position.coords.longitude
    window.currentLocation = { lat, lng }
    createMap()
  }, err => {
    console.log(err.message)
    let lat = 38.9072
    let lng = -77.0369
    window.currentLocation = {lat, lng} //Default location: Wash. DC
    createMap()
  });
}

function createMap(){
  var map = new google.maps.Map(document.getElementById('map'), {
    center: window.currentLocation,
    zoom: 13,
    mapTypeId: 'roadmap'
  });

  // Create the search box and link it to the UI element.
  var input = document.getElementById('pac-input');
  var searchBox = new google.maps.places.SearchBox(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    var place = places[0]
    if (!place.geometry) {
      console.log("Returned place contains no geometry");
      return;
    }
    var icon = {
      url: place.icon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    };

    // Create a marker for each place.
    var marker = new google.maps.Marker({
      map: map,
      icon: icon,
      title: place.name,
      position: place.geometry.location
    })

    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
  });
}
