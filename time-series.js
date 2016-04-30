	var dataPoints_carsInUse = [];
	var chart_carsInUse = new CanvasJS.Chart("carsUsed_graph", {
			title : {
				text : "Cars in Use (0 out of 0)"
			},
			data : [{
					type : "stepLine",
					dataPoints : dataPoints_carsInUse
				}
			]
		});

		function update_carsUsed() {

		  var total = cars.length;
			var used = 0;

		  cars.forEach(function(car) {
		    if(car.used) {
					used++;
				}
		  });

			dataPoints_carsInUse.push({
				x : Date.now(),
				y : used
			});

			chart_carsInUse.options.title.text = "Cars in Use (" + used + " out of " + total + ")";

			chart_carsInUse.render();

		}


	chart_carsInUse.render();





	var dataPoints_carsSpeed = [];
	var chart_carsSpeed = new CanvasJS.Chart("carsSpeed_graph", {
				title:{
				text: "Car Speeds"
				},
				data: [
					{
        type: "line",
        dataPoints: [
        { x: 10, y: 21 },
        { x: 20, y: 25},
        { x: 30, y: 20 },
        { x: 40, y: 25 },
        { x: 50, y: 27 },
        { x: 60, y: 28 },
        { x: 70, y: 28 },
        { x: 80, y: 24 },
        { x: 90, y: 26}

        ]
      },
        {
        type: "line",
        dataPoints: [
        { x: 10, y: 31 },
        { x: 20, y: 35},
        { x: 30, y: 30 },
        { x: 40, y: 35 },
        { x: 50, y: 35 },
        { x: 60, y: 38 },
        { x: 70, y: 38 },
        { x: 80, y: 34 },
        { x: 90, y: 44}

        ]
      }
				]
			});




function update_speedGraph() {

	var data = [];



	cars.forEach(function(car) {

		var points = [];

		car.history.forEach(function(record) {

			//console.log(record);




			points.push({
				//TODO: Change to record.time
				x: record.time,
				//TODO: Change to record.speed
				y: record.speed
			});
		});

		data.push({
			type: 'line',
			xValueType: 'dateTime',
			dataPoints: points
		});



	});

	chart_carsSpeed.options.data = data;

	chart_carsSpeed.render();
}

chart_carsSpeed.render();

$(document).ready(function() {
	$('#time-series').carousel({
		interval:   10000
	});
});

function throwMsg() {

	if(Math.floor(Math.random()*4) == 0) {
		toConsole("Car " + Math.ceil(Math.random()*5) + " stopped w/o handbrake", "error");
	} else {
		toConsole("Car " + Math.ceil(Math.random()*5) + " stalled", "warning");
	}
}

setInterval(function(){throwMsg()}, 15000);
