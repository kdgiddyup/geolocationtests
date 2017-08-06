//  SavTour google maps api key: AIzaSyBPECMronxQUSE7KgmcVqKL5fzDEVpk0u8
$(document).ready(function(){
    var map;
    initMap();
}) // end doc ready


function initMap() {
   // instantiate map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 17
    });
    // establish user's position
    var userMarker;
    var timer;
    var isNew = true;

    // start geolocating cycle
    trackUser(userMarker, timer, 0, isNew);

    // this would become a module for populating the entire map with all the tour stops
    targetMarker = new google.maps.Marker({
        position: {
            lat: 32.275739, 
            lng: -80.925050
        },
        icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#8AB200",
                fillOpacity: .75,
                strokeColor: "#8AB200",
                strokeOpacity: 1.0
            },
        map: map
    });

} // end initMap function

// set interval to continually get user's position; 4000 = 4 seconds
function trackUser(userMarker, timer, seconds, isNew) {     
    clearInterval(timer);
    timer = setTimeout( function(){
        // is this an initial run? don't unset marker 
        if( !isNew ) {
            userMarker.setMap(null);
            isNew = true;
        };
        geoLocate(userMarker,isNew,timer);
        console.log("new position set")
    }, seconds*1000);
}

function geoLocate(userMarker,isNew,timer) {
     // Try HTML5 geolocation.
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            map.setCenter(
                {
                lat: position.coords.latitude,
                lng: position.coords.longitude
                });
            // is this an initial load? set userMarker as a new market and place at map center
            if ( isNew ) {
                isNew=false;
                userMarker = new google.maps.Marker({
                    position: map.getCenter(),
                    icon: {
                        path: google.maps.SymbolPath.CIRCLE,
                        scale: 8,
                        fillColor: "#AA00FF",
                        fillOpacity: .75,
                        strokeColor: "#AA00FF",
                        strokeOpacity: 1.0,
                    },
                    map: map
                });
            }
            // the user marker already exists; just change its position
            else {
                userMarker.setPosition(map.getCenter())
            }

            // set 4-second interval and geolocate again
            trackUser(userMarker, timer, 4, isNew);
        }, 
            // geolocation error function
            function(error){
                console.log(error);
            },
            options
            );
    } 
    else {
        // browser doesn't support geolocation
        handleLocationError(false, map.getCenter());
    } 
}

function handleLocationError(browserHasGeolocation, pos) {
    console.log(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

