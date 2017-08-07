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
    geoLocate(userMarker, newLoad);

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

                        // function to populate map with tour stops, passing along directionsService and directionsDisplay route services
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
    
    // setup direction renderer for routes between user location and selected markers; 
    // we don't want to repeatedly create this service as we only need one instance, so we do it here and pass the object through nested functions until getDirections(), where it's called for
    var dr = new google.maps.DirectionsRenderer(
        {
            draggable: true,
            panel: document.getElementById("directionsPanel"),
            map: map,
            suppressMarkers: true
        }
    );    
    
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
            var targetPos = { 
                    lat: stop.pos.lat, 
                    lng: stop.pos.lng 
                };

            // here we define what should happen when a marker is tapped
            thisMarker.addListener('click', function() {
                var location = stop.data.name;
                $("#stopTitle").html(location);
                $("#stopInfoPanel").html(
                    `<h4>${stop.data.address}</h4>
                    <div class="stopImage">
                        <img src="${stop.data.image}"/></div>
                    <div class="stopDescription">
                        <p>${stop.data.description}</p>
                    </div>`
                );
                // add directions button
                $("#stopInfoFooter").prepend(`<button id="directionsButton" class="btn btn-success">Directions</button>`);

                // add click event to this button
                $("#directionsButton").on("click",function(){
                    
                    // hide modal
                    $("#stopInfo").modal("hide");
                    
                    // hide button - we need to build it dynamically with each marker press
                    $("#directionsButton").remove();
                    
                    // call directions function
                    getDirections(userPos, targetPos, location, dr);
                });
                
                // reveal the info modal for this stop
                $("#stopInfo").modal("show");
            });  // end click event function for markers
        }); // end .each() loop for tour stops array
}  // end addTourStops function

function handleLocationError(browserHasGeolocation, pos) {
    console.log(browserHasGeolocation ?
        'Error: The Geolocation service failed.' :
        'Error: Your browser doesn\'t support geolocation.');
}


function getDirections(userPos, targetPos, location, dr) {
    var origin = new google.maps.LatLng(userPos.lat,userPos.lng);
    var target = new google.maps.LatLng(targetPos.lat,targetPos.lng);
    
    var dirRequest =
        {
            origin: origin,
            destination: target,
            travelMode: "WALKING",
            unitSystem: google.maps.UnitSystem.IMPERIAL,
            provideRouteAlternatives: true
        };

        // set new directions service
        var ds = new google.maps.DirectionsService();
        
        // request route info based on user pos and selected destination
        ds.route(dirRequest, function(result, status) {
        if (status === 'OK') {
            console.log("route requested");
            // dr = DirectionsRenderer service set up in addTourStops()
            dr.setDirections(result);
                
            // update modal window title
            $("#walkingDirectionsTitle").html(`Getting to ${location}`)
            // trigger the modal window
            $("#walkingDirections").modal("show");
        }
    });
}
