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







var cars = [];




var sc = Math.random();
function carFactory() {
  this.createCar = function(carId) {
    var car = {};


    car.carId = carId;

    car.url = 'http://sexlinguistik.de/tamyca/fleetbutler/web/app_dev.php/car' + sc + '_' + carId;
    car.marker = null;
    car.history = [];

    car.speed = 0;
    car.fuel = 50;
    car.ignition = 'on';
    car.doors = 'closed';
    car.lighs = 'off';
    car.handbreak = 'engaged';

    car.loc = null;

    car.used = (Math.round(Math.random()) == 0 ? true : false);

    $('ul#cars').append('<li><button id="button-car-' + carId + '" type = "button" class = "btn btn-default">Car #' + carId + '</button></li>');
    $('#button-car-'+carId).click(function() {
      $('#car-details').html('<ul>' +
        '<li><b>Speed:</b> '+(car.speed).toFixed(2)+'</li>' +
        '<li><b>Fuel Level:</b> '+car.fuel+'</li>' +
        '<li><b>Ignition:</b> '+car.ignition+'</li>' +
        '<li><b>Doors:</b> '+car.doors+'</li>' +
        '<li><b>Lights:</b> '+car.lights+'</li>' +
        '<li><b>Handbreak:</b> '+car.handbreak+'</li>' +
        '</ul>');

      if (car.loc != null)
        mymap.panTo(car.loc);
    });

    car.update_marker = function(data) {

      // Remove old marker
      if(car.marker != null) {
        //mymap.removeLayer(cars[car_index]['marker']);

        car.marker.setLatLng([data['position']['lat'], data['position']['lon']]);
        car.marker.update();
      } else {
        // Add new marker
        car.marker = L.marker([data['position']['lat'], data['position']['lon']], {icon: carIconRed}).addTo(mymap);
      }


      car.speed = data['speed'];
      car.fuel = data['fuel_level'];
      car.ignition = data['ignition'];
      car.doors = data['doors'];
      car.lights = data['lights'];
      car.handbreak = data['handbreak'];

      car.loc = new L.LatLng(data['position']['lat'], data['position']['lon']);

    }

    car.callback = function(data) {

      data.time = Date.now();

      if(car.history.length == 0) {
        data.speed = 0;
      } else {
        data.speed = car.history[car.history.length - 1].speed + Math.random()*10 - 5;

        if(data.speed < 10) {
          data.speed = 10;
        }
        if(data.speed > 300) {
          data.speed = 300;
        }

      }


      car.history.push(data);

      car.update_marker(data);


      data.reasons.forEach(function(reason) {

    		if(reason == "ignition_changed") {

    			if(data.ignition == "on") {
            console.log("Car " + car.carId + " started.");
    				car.used = true;
    			} else {
    				car.used = false;
            console.log("Car " + car.carId + " stopped.");
    			}
          update_carsUsed();
    		}
    	});




      update_graphs();


      car.updateCar();
    }

    car.updateCar = function() {
      $.get(this.url, this.callback);
    }

    toConsole("Car created: " + carId);


    cars.push(car);
    car.updateCar();

  }
}

function update_graphs() {
  update_speedGraph();
}





$(document).ready(function() {

  var fac = new carFactory();

  fac.createCar(1);
  fac.createCar(2);
  fac.createCar(3);
  fac.createCar(4);
  fac.createCar(5);
  fac.createCar(6);
  fac.createCar(7);

});
