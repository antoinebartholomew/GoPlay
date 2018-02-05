// API KEY AIzaSyB1SJ3HV5ZGZkOfwO96Hku1mK2rl3sT_5I

<script>
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
var coordinates = [];
var all_shapes = [];
var selectedShape;
var database = firebase.database();
//var firebase = new Firebase("https://goplay-f0808.firebaseio.com/");

/** Data object to be written to Firebase.  */
var data = {
   sender: null,
   timestamp: null,
   lat: null,
   lng: null
 };
  /**
   * Starting point for running the program. Authenticates the user.
   * @param {function} Called when authentication succeeds.
   */
  function initAuthentication(onAuthSuccess) {
    firebase.authAnonymously(function(error, authData) {
      if (error) {
        console.log('Login Failed!', error);
      } else {
        data.sender = authData.uid;
        onAuthSuccess();
      }
    }, {remember: 'sessionOnly'});  // Users will get a new id for every session.
  }


  // 2. Button for adding Employees
  $("#add-train-btn").on("click", function(event) {
    event.preventDefault();

    // Grabs user input
    var trainName = $("#train-name").val().trim();
    var Destination = $("#Destination").val().trim();

    // Creates local "temporary" object for holding employee data
    var newTrain = {
      name: trainName,
      whereTo: Destination
    };

    // var data = {
    //    sender: null,
    //    timestamp: null,
    //    lat: null,
    //    lng: null
    //  };

    // Uploads employee data to the database
    database.ref().push(newTrain);
    // Logs everything to console
    console.log(trainName.name);
    console.log(Destination.whereTo);
    // Alert
    //alert("New Train Time successfully added");
    // Clears all of the text-boxes
    $("#train-name").val("");
    $("#Destination").val("");

  });

  function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 0, lng: 0},
      zoom: 3,
      styles: [{
      featureType: 'poi',
      stylers: [{ visibility: 'off' }]  // Turn off points of interest.
        }, {
          featureType: 'transit.station',
          stylers: [{ visibility: 'off' }]  // Turn off bus stations, train stations, etc.
        }],
        disableDoubleClickZoom: true
        });

        var infoBoxDiv = document.createElement('div');
        var infoBox = new makeInfoBox(infoBoxDiv, map);
        infoBoxDiv.index = 1;
        map.controls[google.maps.ControlPosition.TOP_CENTER].push(infoBoxDiv);


        var drawingManager = new google.maps.drawing.DrawingManager({
          drawingMode: google.maps.drawing.OverlayType.MARKER,
          drawingControl: true,
          drawingControlOptions: {
            position: google.maps.ControlPosition.TOP_CENTER,
            drawingModes: [
              google.maps.drawing.OverlayType.MARKER,
              google.maps.drawing.OverlayType.POLYGON
            ]
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

    // Listen for clicks and add the location of the click to firebase.
      map.addListener('click', function(e) {
        data.lat = e.latLng.lat();
        data.lng = e.latLng.lng();
        addToFirebase(data);
        console.log(data.lat, data.lng);
      });

        google.maps.event.addListener(map, 'click', function(e) {clearSelection();});

    drawingManager.setMap(map);

  }  //END init Map

  function makeInfoBox(controlDiv, map) {
    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.boxShadow = 'rgba(0, 0, 0, 0.298039) 0px 1px 4px -1px';
    controlUI.style.backgroundColor = '#fff';
    controlUI.style.border = '2px solid #fff';
    controlUI.style.borderRadius = '2px';
    controlUI.style.marginBottom = '22px';
    controlUI.style.marginTop = '10px';
    controlUI.style.textAlign = 'center';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.color = 'rgb(25,25,25)';
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlText.style.fontSize = '100%';
    controlText.style.padding = '6px';
    controlText.innerText = 'The map shows all clicks made in the last 10 minutes.';
    controlUI.appendChild(controlText);
  }



  function initFirebase() {

    // Reference to the clicks in Firebase.
    var clicks = firebase.child('clicks');


    // Listener for when a click is added - add it to the heatmap.
    clicks.orderByChild('timestamp').startAt(startTime).on('child_added',
      function(snapshot) {
        var newPosition = snapshot.val();
        var point = new google.maps.LatLng(newPosition.lat, newPosition.lng);
        heatmap.getData().push(point);
      }
    );
}

  /**
   * Updates the last_message/ path with the current timestamp.
   * @param {function(Date)} addClick After the last message timestamp has been updated,
   *     this function is called with the current timestamp to add the
   *     click to the firebase.
   */
  function getTimestamp(addClick) {
    // Reference to location for saving the last click time.
    var ref = firebase.child('last_message/' + data.sender);

    ref.onDisconnect().remove();  // Delete reference from firebase on disconnect.

    // Set value to timestamp.
    ref.set(Firebase.ServerValue.TIMESTAMP, function(err) {
      if (err) {  // Write to last message was unsuccessful.
        console.log(err);
      } else {  // Write to last message was successful.
        ref.once('value', function(snap) {
          addClick(snap.val());  // Add click with same timestamp.
        }, function(err) {
          console.warn(err);
        });
      }
    });
  }

  /**
   * Adds a click to firebase.
   * @param {Object} data The data to be added to firebase.
   *     It contains the lat, lng, sender and timestamp.
   */
  function addToFirebase(data) {
    getTimestamp(function(timestamp) {
      // Add the new timestamp to the record data.
      data.timestamp = timestamp;
      var ref = firebase.child('clicks').push(data, function(err) {
        if (err) {  // Data was not written to firebase.
          console.warn(err);
        }
      });
    });
  }

  //google.maps.event.addDomListener(window, 'load', init);

</script>
