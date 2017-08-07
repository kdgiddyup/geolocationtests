//  SavTour google maps api key: AIzaSyBPECMronxQUSE7KgmcVqKL5fzDEVpk0u8
$(document).ready(function(){
    var map;
    initMap();
}) // end doc ready


function initMap() {
   // instantiate map
    map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16
    });  

    // start geolocating
    var userMarker = null;
    var newLoad = true;

    // this is the route rendering service for walking directions
    var directionsDisplay = new google.maps.DirectionsRenderer();

    geoLocate(userMarker, newLoad, directionsDisplay);

} // end initMap function


function geoLocate(userMarker,newLoad, directionsDisplay) {

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
                    };

                    // is this the first time this page was loaded? add tour markers and flip newLoad flag
                    if (newLoad) {
                        newLoad = false;

                        // function to populate map with tour stops, passing along directionsDisplay map route service
                        addTourStops(directionsDisplay);
                    }
            }, 
                // geolocation error function
                function(error){
                    console.log(error);
                },
                options
                )
    } 
    else {
        // browser doesn't support geolocation
        // still add markers, but center map generically
        if (newLoad) {
            newLoad = false;
            addTourStops();
        }
        handleLocationError(false, map.getCenter());
    } 
}

function addTourStops(directionsDisplay){
    var userPos = {
        lat: map.getCenter().lat(),
        lng: map.getCenter().lng()
        };
    // we use the tourStops array from tourData.js to populate the map with tour stops
    $(tourStops).each(function(index,stop){
        var thisMarker = new google.maps.Marker({
            position: stop.pos,
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
        thisMarker.addListener('click', function() {
            var targetPos = { 
                lat: stop.pos.lat, 
                lng: stop.pos.lng 
            };
            getDirections(userPos, targetPos, directionsDisplay);
        });
    });
}

function handleLocationError(browserHasGeolocation, pos) {
    console.log(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function getDirections(userPos, targetPos, directionsDisplay) {
    var origin = new google.maps.LatLng(userPos.lat,userPos.lng);
    var target = new google.maps.LatLng(targetPos.lat,targetPos.lng);
    var directionsService = new google.maps.DirectionsService();
    
    var dirRequest =
        {
            origin: origin,
            destination: target,
            travelMode: "WALKING",
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            provideRouteAlternatives: true
        };
    directionsService.route(dirRequest, function(result, status) {
        if (status == 'OK') {
            console.log("Walking route result:",result);
            directionsDisplay.setMap(map);
            directionsDisplay.setDirections(result);
        }
    });
}
