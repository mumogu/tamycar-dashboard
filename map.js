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

var mymap = L.map('mapid').setView(couvenhalle, 11);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoidGFteWNhci1kYXNoYm9hcmQiLCJhIjoiY2lubTAxeng3MDA5d3ZmbTI0cGgxNWF6eSJ9.7UtBXbrs0nw7fOVx_V9xQA', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoidGFteWNhci1kYXNoYm9hcmQiLCJhIjoiY2lubTAxeng3MDA5d3ZmbTI0cGgxNWF6eSJ9.7UtBXbrs0nw7fOVx_V9xQA'
}).addTo(mymap);
	




var markers = [];


function update_marker(){

	$.get(url, function(data) {
		console.log(data);

		// Remove all Markers
		$.each(markers, function(index, value) {
			mymap.removeLayer(value)	
		});

		// Add Markers for test data
		$.each(test_data, function(index, value) {

			var m = L.marker([value['position']['lat'], value['position']['lon']], {icon: carIconRed}).addTo(mymap);
			m.bindPopup("<b>Fahrzeug Nr. 42</b><br>Fuel: 23%<br>Light: off<br>Handbrake: engaged<br>Immobilizer: unlocked");
			
			m.on('click', function(e) {
	        	this.openPopup();
	    	});

			markers.push(m)
		});


		update_markers();
	});

}

var cars = [
	{
		'url': 'http://sexlinguistik.de/tamyca/fleetbutler/web/1', 
		'marker': null
	} ,
	{
		'url': 'http://sexlinguistik.de/tamyca/fleetbutler/web/app.php/2', 
		'marker':  null
	},
	{
		'url': 'http://sexlinguistik.de/tamyca/fleetbutler/web/app.php/3', 
		'marker': null
	},
	{
		'url': 'http://sexlinguistik.de/tamyca/fleetbutler/web/app.php/4', 
		'marker': null
	},
	{
		'url': 'http://sexlinguistik.de/tamyca/fleetbutler/web/app.php/5', 
		'marker': null
	},
	{
		'url': 'http://sexlinguistik.de/tamyca/fleetbutler/web/app.php/6', 
		'marker': null
	},
	{
		'url': 'http://sexlinguistik.de/tamyca/fleetbutler/web/app.php/7', 
		'marker': null
	},
	{
		'url': 'http://sexlinguistik.de/tamyca/fleetbutler/web/app.php/8', 
		'marker': null
	}
];

function add_marker(car_index) {
	var car = cars[car_index];

	$.get(car.url, function(data) {
		// Remove old marker
		if(cars[car_index]['marker'] != null) {
			//mymap.removeLayer(cars[car_index]['marker']);

			cars[car_index]['marker'].setLatLng([data['position']['lat'], data['position']['lon']]);
			cars[car_index]['marker'].update();
		} else {
			// Add new marker
			var mark = L.marker([data['position']['lat'], data['position']['lon']], {icon: carIconRed}).addTo(mymap);
			cars[car_index]['marker'] = mark;
		}
			


		
			/*mark.bindPopup("<b>Fahrzeug Nr. 42</b><br>Fuel: 23%<br>Light: off<br>Handbrake: engaged<br>Immobilizer: unlocked");
			mark.on('click', function(e) {
	        	this.openPopup();
	    	});
*/
	    

	    

	    //update_charts(data)

	    add_marker(car_index);
	});


}

$(document).ready(function() {


	add_marker(0);
	add_marker(1);
	add_marker(2);
	add_marker(3);
	add_marker(4);
	add_marker(5);
	add_marker(6);
	add_marker(7);
});
