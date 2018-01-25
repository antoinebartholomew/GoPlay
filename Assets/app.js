

var map;

function initMap(page) {

  map = undefined;
  var bounds = new google.maps.LatLngBounds();
  var mapOptions = {
    mapTypeId: "roadmap"
  };

  map = new google.maps.Map(document.getElementById("map"), mapOptions);
  map.setTilt(45);

  var infoWindow = new google.maps.InfoWindow(),
    marker, i;

  for (i = 0; i < markers.length; i++) {


    var position = new google.maps.LatLng(markers[i]["lat"], markers[i]["long"]);
    bounds.extend(position);
    marker = new google.maps.Marker({
      position: position,
      map: map,
      title: markers[i]["name"]
    });

    google.maps.event.addListener(marker, "click", (function(marker, i) {
      return function() {
        infoWindow.setContent(infoWindowContent[i]);
        infoWindow.open(map, marker);
      }
    })(marker, i));
  }

  map.fitBounds(bounds);

  var boundsListener = google.maps.event.addListener((map), "bounds_changed", function(event) {
    this.setZoom(13);
    google.maps.event.removeListener(boundsListener);
  });
}
