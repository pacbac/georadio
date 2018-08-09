var markerIcon = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'

function initAutocomplete() {
  navigator.geolocation.getCurrentPosition(position => {
    let lat = position.coords.latitude
    let lng = position.coords.longitude
    window.currentLocation = { lat, lng }
    changeLoc()
    createMap()
  }, err => {
    console.log(err.message, "\nLoading default location instead: Washington DC")
    let lat = 38.9072
    let lng = -77.0369
    window.currentLocation = {lat, lng} //Default location: Wash. DC
    changeLoc()
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

  var icon = {
    url: markerIcon,
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(25, 25)
  }

  window.marker = new google.maps.Marker({
    map,
    icon,
    title: 'Init Location',
    position: window.currentLocation
  })

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
      url: markerIcon,
      size: new google.maps.Size(71, 71),
      origin: new google.maps.Point(0, 0),
      anchor: new google.maps.Point(17, 34),
      scaledSize: new google.maps.Size(25, 25)
    }

    // Create a marker for each place.
    marker.setMap(null)
    marker = new google.maps.Marker({
      map: map,
      icon: icon,
      title: place.name,
      position: place.geometry.location
    })

    $(".song-list").html("")
    currentLocation = {lat: place.geometry.location.lat(), lng: place.geometry.location.lng()}
    changeLoc()

    if (place.geometry.viewport) {
      // Only geocodes have viewport.
      bounds.union(place.geometry.viewport);
    } else {
      bounds.extend(place.geometry.location);
    }
    map.fitBounds(bounds);
  });

  map.addListener('click', () => {
    /*May add in clickable map feature, if not use searchbar*/
  })
}

function changeLoc(){
  $.get("/playlist", {loc: currentLocation}, data => {
    data = JSON.parse(data)
    console.log(data)
    if(!data.valid)
      $(".song-list").html(`<div class="song-error">
        Error: Could not retrieve tracks
      </div>`)
    else if(!data.playlist.length)
      $(".song-list").html(`<div class="no-songs">
        No one has posted in this location yet. You can be the first!
      </div>`)
    else {
      $(".song-list").html("")
      for(let i = 0; i < data.playlist.length; i++) {
        $(".song-list").append(`<div class="track">
          <p src="${data.playlist[i][1]}">${data.playlist[i][0]}<span class="artist"> - ${data.playlist[i][3]}</span></p>
          <img src="${data.playlist[i][2]}" width=50 height=50>
        </div>`)
      }
    }

  }).fail(() => $(".song-list").html(`<div class="song-error">
      Error: Could not retrieve tracks
    </div>`))
}
