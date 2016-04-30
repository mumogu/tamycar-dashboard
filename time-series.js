car_history = [];

function update_charts(data, car_index) {
	if(car_history[car_index] == undefined) {
		car_history[car_index] = [];
		console.log(data);

		cars_total++;
	}

	car_history[car_index].push(data);

	//if(data.)

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



	var updateChart = function () {

		yVal = yVal + Math.round(5 + Math.random() * (-5 - 5));
      	updateCount++;

		dataPoints.push({
			y : yVal
		});

        chart.options.title.text = "Update " + updateCount;
		chart.render();

	};
