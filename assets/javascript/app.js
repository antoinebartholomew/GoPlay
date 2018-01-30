// API KEY AIzaSyB1SJ3HV5ZGZkOfwO96Hku1mK2rl3sT_5I

<script type="text/javascript">
  //this is JQuery
function $(id) {
        return document.getElementById(id);
}

var mapkml;


var map;
var marker = null;
var poly;
var elevator;
var UMD = new google.maps.LatLng(38.98982735892874, -76.94305801443988);

var markersArray = [];
var markers = [];
var line;

var layerTOC;

//instantiate a geocoder for interpreting addresses
geocoder = new google.maps.Geocoder();  //http://w3schools.invisionzone.com/index.php?showtopic=45189

var locations = [];


var infowindow = new google.maps.InfoWindow(  //key part for left click markers to show !@!!!!!!
  { size: new google.maps.Size(256,256)// what does this 256 size mean/matter...https://developers.google.com/maps/documentation/javascript/maptypes#TileCoordinates
  });


// Enable the visual refresh,  https://developers.google.com/maps/documentation/javascript/basics
google.maps.visualRefresh = true;

function initialize() {

    //Add Census KML layer
	  var MDcensus = new google.maps.KmlLayer('https://www.terpconnect.umd.edu/~abartho1/GEOG_677_Internet_GIS/Lab%202/MDcensus.kml');

	  MDcensus.setMap(map);

	   //Add transit layer
	  var transitLayer = new google.maps.KmlLayer('https://www.terpconnect.umd.edu/~abartho1/GEOG_677_Internet_GIS/Lab%202/UMDTransit.kmz');
	  transitLayer.setMap(map);

	  layerTOC = {MDcensus : MDcensus,
	transitLayer : transitLayer};

directionsDisplay = new google.maps.DirectionsRenderer();



  var mapOptions = {
    zoom: 14,
    //heading: 90,
    //tilt: 45,  // Note: 45 degree imagery is only available at certain zoom levels (18,19,20) and certain areas.  45.518970, -122.672899 Portland   http://google-latlong.blogspot.com/2012/09/imagery-update-explore-more-of-world-in.html  DETAILS ABOUT 45 TILT LOCATIONS
    keyboardShortcuts: true,
    //draggable: false,
    disableDoubleClickZoom: true,
    minZoom: 1,// set the min zoom not to go out too far
    maxZoom: 24, // 20 is the (closest) max zoom level in google maps
    panControl: true,
    panControlOptions: {
    position: google.maps.ControlPosition.TOP_LEFT}, // changes the position of the control slider
    disableDefaultUI: false,
    zoomControl: true,
    zoomControlOptions: {
    style: google.maps.ZoomControlStyle.LARGE,
    position: google.maps.ControlPosition.LEFT_TOP}, // changes the position of the control slider

    scaleControl: true,//https://developers.google.com/maps/documentation/javascript/examples/control-simple

    center: new google.maps.LatLng(38.98982735892874, -76.94305801443988),

    mapTypeControlOptions: {
    mapTypeIds: [google.maps.MapTypeId.ROADMAP,google.maps.MapTypeId.HYBRID, google.maps.MapTypeId.SATELLITE],// add OSM All Data and Buildings layers later.
    draggable: true,
    style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR //http://stackoverflow.com/questions/8354163/google-map-api-3-wms
    //Style Options: google.maps.MapTypeControlStyle.HORIZONTAL_BAR - display one button for each map type....DROPDOWN_MENU - select map type via a dropdown menu....DEFAULT - displays the "default" behavior (depends on screen size)

    }//end mapTypeControlOptions
  };  //end varMapOptions

  map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);


  map = new google.maps.Map($('map-canvas'), mapOptions);
        line = new google.maps.Polyline({
          map: map,
          strokeColor: "#6633FF",
          strokeOpacity: 0.5,
          strokeWeight: 10
        });

        var polyOptions = {
          strokeColor: '#000000',
          strokeWeight: 0,
          fillOpacity: 0.45,
          editable: true
        };

        // created a double click event.
  google.maps.event.addListener(map, 'dblclick', function(event) {
          var marker = new google.maps.Marker({
            map: map,
            position: event.latLng,
            draggable:true// this provides significant funcationality
          });
          markers.push(marker);
          drawPath();

          google.maps.event.addListener(marker, 'dblclick', function(event) {
            marker.setMap(null);
            drawPath();
          });

          google.maps.event.addListener(marker, 'drag', function(event) {
            drawPath();
          });
        });

  google.maps.event.addListener(line, 'dblclick', function(event) {
          for (var i = 0 ; i < markers.length - 1; i++) {
            if(isPointOnSegment(markers[i].getPosition(),
               markers[i+1].getPosition(),event.latLng)) {
              addMarker(event.latLng, i+1);
              break;
            }
          }
        });

  function addMarker(pos, where) {
        var marker = new google.maps.Marker({
          map: map,
          position: pos,
          draggable: true
        });
          google.maps.event.addListener(marker, 'dblclick', function(event) {
            marker.setMap(null); //changed from (null) to (map)...I want to set all markers to the map
            drawPath();
          });

          google.maps.event.addListener(marker, 'drag', function(event) {
            drawPath();
          });
        markers.splice(where,0,marker);
        drawPath();
      }//end function addMarker


  function countMarkers() {
        count = 0;
        for (var i = markers.length - 1; i >= 0; i--) {
          if (markers[i].getMap() == null) {
            markers.splice(i, 1);
          } else {
            count++;
          }
        }
        return count;
      } //end function countMarkers

  function createMarker(latlng, name, html) {
    var contentString = html;
    var marker = new google.maps.Marker({
        position: latlng,
        draggable:true, // this provides significant funcationality
        map: map,
        zIndex: Math.round(latlng.lat()*-100)<<5
        });
   markers.push(marker);

google.maps.event.addListener(marker, 'rightclick', function() {

locations.push(latlng);

var positionalRequest = {
    'locations': locations
  }


   });// created a right click event, so to free up a single or doubble click event
       google.maps.event.trigger(marker,'rightclick');
   return marker;
   } // end function createMarker

   // This function creates the right click lat/lng point markers, A function to create the marker and set up the event window function
  //this is the second part of code for the lat/lng event listener...http://www.geocodezip.com/v3_example_click2add_infowindow.html
  google.maps.event.addListener(map, 'rightclick', function() {
        infowindow.close();
        });

  google.maps.event.addListener(map, 'rightclick', function(event) {
	//call function to create marker
         if (marker) {
            marker.setMap(null); // this code removes the marker //this code......marker.setMap(map); makes the markers stay on the map

            //marker = null;
         }
	 marker = createMarker(event.latLng, "name", "<b>Location</b><br>"+event.latLng);
  });

  directionsDisplay.setMap(map);  // sets the map directions


  trafficLayer.setMap(null);
  google.maps.event.addListener(map, "zoom_changed", function() {
    if (map.getZoom() <= 14 && map.getZoom() >= 12) trafficLayer.setMap(map);
    else trafficLayer.setMap(null);
    });

	weatherLayer.setMap(null);
	google.maps.event.addListener(map, "zoom_changed", function() {
    if (map.getZoom() <= 8 && map.getZoom() >= 2 )  weatherLayer.setMap(map);
    else  weatherLayer.setMap(null);
    });


   }//  END of The function initialize

    //Toggle layer visibility
      function toggleLayer(layerName){
         var layer = layerTOC[layerName];
         if(layer.getMap() == map){
		layer.setMap(null);
         }else{
		layer.setMap(map);
         }
      }



function setAllMap(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the overlays from the map, but keeps them in the array.
function clearOverlays() {
  setAllMap(null);
}

// Shows any overlays currently in the array.
function showOverlays() {
  setAllMap(map);
}


// Deletes all markers in the array by removing references to them.
function deleteOverlays() {
  clearOverlays();
  markers = [];
  markersArray = [];
  locations = [];
}// end   function deleteOverlays

   // http://w3schools.invisionzone.com/index.php?showtopic=45189
function search() {
  var searchText = document.getElementById('search_address').value;
  if (searchText != '') {
   geocoder.geocode({
    address: searchText
   }, function (results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
	 var viewport = results[0].geometry.viewport;
	 var location = results[0].geometry.location;
	 if (viewport) {
	  map.fitBounds(viewport);
	 } else {
	  map.setCenter(location);
	 }
    }
   });
  } // I want to add a marker to show in the map http://stackoverflow.com/questions/6140303/google-maps-v3-how-to-center-using-an-address-on-initialize

} //end function search







google.maps.event.addDomListener(window, 'load', initialize);

</script>
