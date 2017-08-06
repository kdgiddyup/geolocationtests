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
    geoLocate(userMarker,newLoad);

} // end initMap function


function geoLocate(userMarker,newLoad) {

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
                        addTourStops();
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

function addTourStops(){
    var userPos = `${map.getCenter().lat()},${map.getCenter().lng()}`;
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
            getDirections(userPos,`${stop.pos.lat},${stop.pos.lng}`);
        });
    });
}

function handleLocationError(browserHasGeolocation, pos) {
    console.log(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}

function getDirections(userPos, targetPos) {
    //41.43206,-81.38992
    var query = `https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=${userPos}&destinations=${targetPos}&mode=walking&key=AIzaSyA6Rsd_FbqSDftXyU8494oVNVV14q9zLIg`;   
    $.get(query,function(response){
        console.log(response);
    })
}