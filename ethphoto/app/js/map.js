var map;
var gmarkers = [];

var infowindow = null;
// console.log("REACHED HERE!!!");

function CenterControl(controlDiv, map) {

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.marginTop = '2px';
  controlUI.style.marginLeft = '10px';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'My Location';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.color = 'rgb(25,25,25)';
  controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  controlText.style.fontSize = '16px';
  controlText.style.lineHeight = '20px';
  controlText.style.paddingLeft = '3px';
  controlText.style.paddingRight = '3px';
  controlText.style.paddingBottom= '3px';
  controlText.innerHTML = '<img src="../images/myloc.png" width="auto" height="17" >';
  controlUI.appendChild(controlText);

  // Setup the click event listeners: simply set the map to Chicago.
  controlUI.addEventListener('click', function() {
    //map.setCenter(chicago);
    if (navigator.geolocation) {
        console.log('geolocation')
            // console.log(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position.coords.latitude);
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
            map.setZoom(15);
        });
    }
  });

}

function zoomComplete() {
  map.setZoom(0);

}
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 10,
        center: { lat: -37.363, lng: 150.044 },
        zoomControlOptions: {
              position: google.maps.ControlPosition.LEFT_TOP
        },
        streetViewControlOptions: {
              position: google.maps.ControlPosition.LEFT_TOP
        }
    });

    var centerControlDiv = document.createElement('div');
    var centerControl = new CenterControl(centerControlDiv, map);

    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.LEFT_TOP].push(centerControlDiv);

    console.log("REACHED HERE!!!");
    //searchBox();
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input');
    // var types = document.getElementById('type-selector');

    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
    var autocomplete = new google.maps.places.Autocomplete(input);
    console.log(autocomplete);
    autocomplete.bindTo('bounds', map);
    
    autocomplete.addListener('place_changed', function() {
      // infowindow.close();
      // marker.setVisible(false);
      var place = autocomplete.getPlace();
      if (!place.geometry) {
        // User entered the name of a Place that was not suggested and
        // pressed the Enter key, or the Place Details request failed.
        window.alert("No details available for input: '" + place.name + "'");
        return;
      }

      // If the place has a geometry, then present it on a map.
      if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
      } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);  // Why 17? Because it looks good.
      }
      // marker.setPosition(place.geometry.location);
      // marker.setVisible(true);


      // infowindowContent.children['place-icon'].src = place.icon;
      // infowindowContent.children['place-name'].textContent = place.name;
      // infowindowContent.children['place-address'].textContent = address;
      // infowindow.open(map, marker);
    });
    infowindow = new google.maps.InfoWindow({
                content: "loading..."
            });
    google.maps.event.addListener(map, 'onclick', function(event) {
        // alert(event.latLng); 
        console.log(event.latLng);
    });

    google.maps.event.addListener(map, 'idle', function() {
        // zoomLevel = map.getZoom();
        console.log("Became idle");
        var bounds = map.getBounds();
        var NECorner = bounds.getNorthEast();
        var SWCorner = bounds.getSouthWest();
        setScreenPoints(NECorner.lat(), NECorner.lng(), SWCorner.lat(), SWCorner.lng());
    });


    if (navigator.geolocation) {
        console.log('geolocation')
            // console.log(navigator.geolocation)
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            map.setCenter(pos);
        });
    }
    searchBox("manualLocation")

}

function searchBox(id="pac-input") {

    var input = document.getElementById(id);
    var searchBox = new google.maps.places.SearchBox(input);
    // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

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

        // Clear out the old markers.

        // For each place, get the icon, name and location.
        var bounds = new google.maps.LatLngBounds();
        places.forEach(function(place) {
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



            if (place.geometry.viewport) {
                // Only geocodes have viewport.
                bounds.union(place.geometry.viewport);
            } else {
                bounds.extend(place.geometry.location);
            }
        });
        map.fitBounds(bounds);
    });
}
var markerCluster ;
var flag = 0;

var loading = "../images/load_new.png";
var color1 = '../images/animal_icon.png';
var color2 = '../images/nature_icon.png';
var color3 = '../images/object_icon.png';
var color4 = '../images/people_icon.png';
var color5 = '../images/bird_icon.png';
var color6 = 'http://maps.google.com/mapfiles/ms/icons/pink-dot.png';
var color7 = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
var color8 = 'http://maps.google.com/mapfiles/ms/icons/paleblue-dot.png';
var color9 = 'http://maps.google.com/mapfiles/ms/icons/darkgreen-dot.png';
var color10 = 'http://maps.google.com/mapfiles/ms/icons/brown-dot.png';

var tag_color = [color1,color2,color3,color4,color5,color6,color7,color8,color9,color10];
var singleMarker ;
function singleSetMarker(location){
        var marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            icon: loading
        });


       //gmarkers.push(marker);
       singleMarker = marker;
}

function deleteSingleMarker(){
  singleMarker.setMap(null);
}
function setMarkers(locations, add = 0) {

    console.log("IN SET MARKERS")
    if (add == 0) {
        //console.log("\n\n\nHello");
        //console.log(gmarkers.length + " " + locations.length + "\n\n\n");
        console.log("the length is "+locations.length)
        for (i = 0; i < gmarkers.length; i++) {
            
            console.log("hi"+i);
            gmarkers[i].setMap(null);
        }
        
        if(flag)
        {
        markerCluster.clearMarkers();
        }
        gmarkers = [];
    }
    var tags = getTags();
    for (var i = 0; i < locations.length; i++) {
        var location = locations[i];
        console.log("printing locations");
        console.log(location.lat,location.lng);
        flag = 1;
        var marker = new google.maps.Marker({
            position: { lat: location.lat, lng: location.lng },
            map: map,
            icon:tag_color[tags[i]]
        });

        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                var x = marker.getPosition().lat();
                var y = marker.getPosition().lng();
                console.log("marker clicked");
                images = getImage1();
                
                console.log(locations.length)
                console.log(x,y);
                for(var i=0;i<locations.length;i++){
                    click_x=Number(locations[i].lat);
                    click_y=Number(locations[i].lng);
                    console.log(Number(click_x.toFixed(7)),Number(click_y.toFixed(7)))
                    if(Number(click_x.toFixed(7)) == Number(x.toFixed(7)) && Number(click_y.toFixed(7))==Number(y.toFixed(7))){
                        console.log("MARKER FOUND"+images[i]);
                        break;
                    } 
                }
                
                        
                infowindow.setContent("<p>Category= "+InverseTag(tags[i])+"</p><IMG width = 'auto' height = '150' SRC="+images[i]+">");
                infowindow.open(map,marker);

            }
        })(marker, i));
        // console.log(location);
        gmarkers.push(marker);
    }

    // console.log("setMap");

    markerCluster = new MarkerClusterer(map, gmarkers,
     { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
    // console.log("bdbfd");

}
