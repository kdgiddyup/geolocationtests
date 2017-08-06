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

    // this would become a module for populating the entire map with all the tour stops
    targetMarker = new google.maps.Marker({
        position: { 
            lat: 32.275440, 
            lng: -80.925087
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

    // start geolocating
    var userMarker = null;
    geoLocate(userMarker);

} // end initMap function


function geoLocate(userMarker) {

    // Try HTML5 geolocation.
    var options = {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 0
    };
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(function(position) {
            map.setCenter(
                {
                lat: position.coords.latitude,
                lng: position.coords.longitude
                });
                if (userMarker === null) {
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
                else {
                    userMarker.setPosition(map.getCenter());
                }
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