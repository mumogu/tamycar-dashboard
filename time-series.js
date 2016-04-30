car_history = [];


toConsole('test');

function update_charts(data, car_index) {

	if(car_history[car_index] == undefined) {
		car_history[car_index] = [];

	}

	car_history[car_index].push(data);



	data.reasons.forEach(function(reason) {
		//console.log(reason);
		if(reason == "ignition_changed") {
			console.log(data['ignition']);
			if(data.ignition == "on") {
				increase_carsInUse(data.time);
			} else {
				decrease_carsInUse(data.time);
			}
		}
	});

}


	var dataPoints_carsInUse = [];
	var chart = new CanvasJS.Chart("time-series", {
			title : {
				text : "Cars in Use"
			},
			data : [{
					type : "stepLine",
					dataPoints : dataPoints_carsInUse
				}
			]
		});

	chart.render();

	var cars_inUse = 0, cars_total = 0;
	function increase_carsInUse(timestamp) {
		if(cars_inUse == cars_total) {
			console.log("Something went wrong!");

		} else {
			cars_inUse++;
			updateChart(timestamp);
		}
	}

	function decrease_carsInUse(timestamp) {
		if(cars_inUse == 0) {
			console.log("Something went wrong!");

		} else {
			cars_inUse--;
			updateChart(timestamp);
		}
	}



	var updateChart = function (timestamp) {

		dataPoints.push({
			x : timestamp,
			y : cars_inUse
		});

		chart.render();

	};
