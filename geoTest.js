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
    var isNew = true;

    // start geolocating
    geoLocate(userMarker,isNew);

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


function geoLocate(userMarker) {
     // Try HTML5 geolocation.
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(function(position) {
            map.setCenter(
                {
                lat: position.coords.latitude,
                lng: position.coords.longitude
                });
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