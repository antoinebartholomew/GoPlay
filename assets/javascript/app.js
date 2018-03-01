
  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyAliuFROXxq9K-tkBr7WDMwsJBEPrAMqxY",
    authDomain: "goplay-f0808.firebaseapp.com",
    databaseURL: "https://goplay-f0808.firebaseio.com",
    projectId: "goplay-f0808",
    storageBucket: "",
    messagingSenderId: "554942210651"
  };
  firebase.initializeApp(config);
  var map;
  var polygonArray = [];
  var = firebasePolygons = [];
  var = firebaseMarkers = [];
  // var = firebasePolygons = ['https://goplay-f0808.firebaseio.com/userInfo/coordinates'];
  //var = firebaseMarkers = [https://goplay-f0808.firebaseio.com/userInfo/clustermarkers.json];
  var locations = [];
  var database = firebase.database();
  //var PolygonTypeRef = database.ref('polygonDetails');
  //var dbRef = firebase.database();
  //var userInfoRef = dbRef.ref('userInfo');
  //save contact
  document.querySelector('.addValue')
    .addEventListener("click", function( event ) {
      event.preventDefault();
      if( document.querySelector('#name').value != ''
            || document.querySelector('#email').value != '' ){
        userInfoRef.push({
          name: document.querySelector('#name').value,
          email: document.querySelector('#email').value,
          coordinates: {
            city1: document.querySelector('#city').value,
             state: document.querySelector('#state').value,
            zip: document.querySelector('#zip').value
          }
          //polygonLocation: document.querySelector('#map').value
        });
        contactForm.reset();
      } else {
        alert('Please fill at lease name or email!');
      }
    },
        false);
  function firebasePolygons (map) {
    // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
    database.ref('userInfo/coordinates').on("value", function(childSnapshot, prevChildKey) {
      console.log(childSnapshot.val());
      var poly = childSnapshot.val().name;
      //firebasePolygons.setMap(map)
      //poly.Polygons.set(map);
    });
  }
 function firebaseMarkers (map) {
    // 3. Create Firebase event for adding employee to the database and a row in the html when a user adds an entry
    database.ref('userInfo/clustermarkers').on("value", function(childSnapshot, prevChildKey) {
      console.log(childSnapshot.val());

        // for (var i = 0; i < marker; i++) {
        //   this.markersCluster[i].setMap(map);
        //   markerCluster.addMarker(markers);
        // }





      //new = markersFromFirebase = snapshot.val();
      //curl 'https://goplay-f0808.firebaseio.com/userInfo/clustermarkers.json'
      // Get that click from firebase.
       //var newPosition = snapshot.val();
      //  var point = new google.maps.LatLng(newPosition.lat, newPosition.lng);
      //var poly = childSnapshot.val().name;
      //firebasePolygons.setMap(map)
      //poly.Polygons.set(map);


    });
 }
//  // pass the initialised map to the function
//
//         var database = firebase.database();
//         database.ref('userInfo/clustermarkers').ones('value', points => {
//             points.forEach(point=>{
//                 marker = new google.maps.Marker({
//                          map:map,
//                          position: {
//                               lat: point.val().lat,
//                               lng: point.val().lng
//                          }
//                 })
//               marker.setMap(map) // Set market on the map
//              })
//         })
//
//
//
// }
  function initMap() {
    var myLatlng = new google.maps.LatLng (38.80741,-77.045016);
    var myOptions = {
     zoom: 14,
     zoomControl: true,
     zoomControlOptions: {
     style: google.maps.ZoomControlStyle.LARGE,
     position: google.maps.ControlPosition.LEFT_TOP},
     center: myLatlng,
     disableDoubleClickZoom: true,
     panControlOptions: {position: google.maps.ControlPosition.TOP_LEFT},
     mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    map = new google.maps.Map(document.getElementById('map'), myOptions);
    //http://jsfiddle.net/geocodezip/qe68usv3/1/
    var drawingManager = new google.maps.drawing.DrawingManager({
    drawingMode: google.maps.drawing.OverlayType.POLYGON,
    drawingControl: true,
    drawingControlOptions: {
      position: google.maps.ControlPosition.TOP_CENTER,
      drawingModes: ['circle', 'marker', 'polygon']
    },
        markerOptions: {icon: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png'},
        circleOptions: {
          fillColor: '#ffff00',
          fillOpacity: 1,
          strokeWeight: 5,
          clickable: false,
          editable: true,
          zIndex: 1
        }
      });
    drawingManager.setMap(map);
    // google.maps.event.addListener(map, 'dblclick', function(event) {
    //   var latitude = event.latLng.lat();
    //   var longitude = event.latLng.lng();
    //   console.log( latitude + ', ' + longitude );
    //     //alert(event.latLng);
    // });
    google.maps.event.addListener(drawingManager, 'circlecomplete', function(circle) {
      var radius = circle.getRadius();
      console.log(circle);
    });
    google.maps.event.addListener(drawingManager, 'polygoncomplete', function(polygon) {
          var polyLength = polygon.getPath().getLength();
          // need to empty the arrary each time a polygon is created
          //   console.log(polyLength);
          for (var i = 0; i < polyLength; i++) {
              var poly = polygon.getPath().getAt(i).toUrlValue(6);
              polygonArray.push(poly);
          }
          database.ref('userInfo/coordinates').push(polygonArray);
          console.log(polygonArray);
      });
      //http://jsfiddle.net/geocodezip/b4orpLv3/2/
      //https://stackoverflow.com/questions/46261237/add-markers-to-google-maps-that-will-go-into-a-marker-cluster
      var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var infoWin = new google.maps.InfoWindow();
      var markers = locations.map(function(location, i) {
        return new google.maps.Marker({
          position: location,
          userName: name,
          activity: activity,
          label: labels[i % labels.length]
        });
      });
      function addMarker(location) {
        var marker = new google.maps.Marker({
          position: location,
          userName: name,
          map: map
        });
        markerCluster.addMarker(marker);
        database.ref('userInfo/clustermarkers').push(markers);
      }

      // addMarker(location, image) {
      //     let marker = new google.maps.Marker({
      //       position: location,
      //       map: this.map,
      //       icon: image
      //     });
      //     this.markers.push(marker);
      //   }




      //Add Marker click function
      map.addListener('dblclick', function(event) {
        addMarker(event.latLng);
        markers.lat = event.latLng.lat();
        markers.lng = event.latLng.lng();


      //addToFirebase(markers);
        console.log(locations);
      });
      // Add a marker cluster to manage the markers.
      var markerCluster = new MarkerClusterer(map, markers, {
        imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
      });
    } // end inti fuction
    /////////////////
    //Get data OUT of Firebase
    ////////////////
    //
    //
    // map.data.add({geometry: new google.maps.Data.Polygon([firebasePolygons,
    //                                               firebaseMarkers
    //                                                 ])})
    // https://stackoverflow.com/questions/28596237/loading-a-geojson-object-directly-into-google-maps-v3
    //     map.data.addGeoJson();
    //
    //
    // }
  //google.maps.event.addDomListener(window, 'load', initMap);
