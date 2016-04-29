var carIconBlue = L.icon({
    iconUrl: 'images/pin-blue.png',
    shadowUrl: 'images/pin-shadow.png',

    iconSize:     [63.4, 54.1], // size of the icon
    shadowSize:   [63.4, 54.1], // size of the shadow
    iconAnchor:   [0, 54.1], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 54.1],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var carIconRed = L.icon({
    iconUrl: 'images/pin-red.png',
    shadowUrl: 'images/pin-shadow.png',

    iconSize:     [63.4, 54.1], // size of the icon
    shadowSize:   [63.4, 54.1], // size of the shadow
    iconAnchor:   [0, 54.1], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 54.1],  // the same for the shadow
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var carIconGreen = L.icon({
    iconUrl: 'images/pin-green.png',
    shadowUrl: 'images/pin-shadow.png',

    iconSize:     [63.4, 54.1], // size of the icon
    shadowSize:   [63.4, 54.1], // size of the shadow
    iconAnchor:   [0, 54.1], // point of the icon which will correspond to marker's location
    shadowAnchor: [0, 54.1],  // the same for the shadow
    popupAnchor:  [30, -54.1] // point from which the popup should open relative to the iconAnchor
});

var couvenhalle = [50.776726, 6.078790];

var mymap = L.map('mapid').setView(couvenhalle, 13);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGFteWNhci1kYXNoYm9hcmQiLCJhIjoiY2lubTAxeng3MDA5d3ZmbTI0cGgxNWF6eSJ9.7UtBXbrs0nw7fOVx_V9xQA', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidGFteWNhci1kYXNoYm9hcmQiLCJhIjoiY2lubTAxeng3MDA5d3ZmbTI0cGgxNWF6eSJ9.7UtBXbrs0nw7fOVx_V9xQA'
}).addTo(mymap);

var test_data =[
	{"position":{"lat":couvenhalle[0],"lon":couvenhalle[1],"time":"2014-04-18 09:41:00 UTC"},"reasons":"central_lock_changed,immobilizer_changed","fuel_level":"45","immobilizer":"unlocked","ignition":"off","central_lock":"locked","speed":"0","voltage":"12.66","mileage":"9438.1","doors":"closed","lights":"off","handbrake":"unlocked"},
	{"position":{"lat":50.771294,"lon":6.093263,"time":"2014-04-18 09:41:00 UTC"},"reasons":"central_lock_changed,immobilizer_changed","fuel_level":"45","immobilizer":"unlocked","ignition":"off","central_lock":"locked","speed":"0","voltage":"12.66","mileage":"9438.1","doors":"closed","lights":"off","handbrake":"unlocked"}
] 
	




var markers = [];


function update_markers(){

	$.get('http://sexlinguistik.de/tamyca/fleetbutler/web/app.php/test', function(data) {
		console.log(data);
        console.log(data['position']);

		// Remove all Markers
		$.each(markers, function(index, value) {
			mymap.removeLayer(value)	
		});

		// Add Markers for test data
		var m = L.marker([data['position']['lat'], data['position']['lon']], {icon: carIconGreen}).addTo(mymap);
		m.bindPopup("<b>Fahrzeug Nr. 42</b><br>Fuel: 23%<br>Light: off<br>Handbrake: engaged<br>Immobilizer: unlocked");
		
		m.on('click', function(e) {
        	this.openPopup();
    	});

		markers.push(m)

		update_markers();
	});

}


$('#get-data').click(function(){
	update_markers();
});
