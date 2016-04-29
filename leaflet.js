
var mymap = L.map('mapid').setView([50.774349, 6.082457], 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGFteWNhci1kYXNoYm9hcmQiLCJhIjoiY2lubTAxeng3MDA5d3ZmbTI0cGgxNWF6eSJ9.7UtBXbrs0nw7fOVx_V9xQA', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidGFteWNhci1kYXNoYm9hcmQiLCJhIjoiY2lubTAxeng3MDA5d3ZmbTI0cGgxNWF6eSJ9.7UtBXbrs0nw7fOVx_V9xQA'
}).addTo(mymap);

//var marker = L.marker([50.774349, 6.082457]).addTo(mymap);

var carIcon = L.icon({
    iconUrl: 'images/pin.png',
    shadowUrl: 'images/pin-shadow.png',

    iconSize:     [63.4, 54.1], // size of the icon
    shadowSize:   [63.4, 54.1], // size of the shadow
    iconAnchor:   [0, 54.1], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 54.1],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


var test_data = {"position":{"lat":50.770628,"lon":6.073202,"time":"2014-04-18 09:41:00 UTC"},"reasons":"central_lock_changed,immobilizer_changed","fuel_level":"45","immobilizer":"unlocked","ignition":"off","central_lock":"locked","speed":"0","voltage":"12.66","mileage":"9438.1","doors":"closed","lights":"off","handbrake":"unlocked"};

var marker = null;

$('#get-data').click(function(){
	//marker = L.marker([50.774349, 6.082457]).addTo(mymap);
	marker = L.marker([50.776726, 6.078790], {icon: carIcon}).addTo(mymap);

});

$('#change-data').click(function() {
	marker.setLatLng([50.779331, 6.088612]);
	marker.update();
});

