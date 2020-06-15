// js file for index.html

// Show current temperature
function showTemperatuur(json) {
	let newDate = new Date(json.time);
	newDate.setHours(newDate.getHours() - 2);
	newDate = newDate.toLocaleString("nl-be", { timeZone: "Europe/Brussels" });
	html_current_temp.innerHTML = `
		<p>
			It's ${json.value} degrees inside.
		</p>
		<p> 
			Last check: ${newDate}
		</p>`;
}

function showChart(json) {
	var ctx = document.querySelector("#myChart").getContext("2d");
	console.log(json);

	let times = [];
	let values = [];
	json.forEach((i) => {
		// set correct timezone
		let newDate = new Date(i.time);
		newDate.setHours(newDate.getHours() - 2);
		//push date to times array
		times.push(newDate);
		//push values to values array
		values.push(i.value);
	});

	let timeFrame = getTimeFrame();

	let timeFrames = {
		"1": "minute",
		"12": "hour",
		"24": "hour",
		"168": "day",
	};

	var myChart = new Chart(ctx, {
		type: "line",
		data: {
			labels: times,
			datasets: [
				{
					label: "Temperature in °C",
					data: values,
					backgroundColor: "#3345FF",
					pointRadius: 2,
					pointBackgroundColor: "#3345FF",
					borderColor: "#3345FF",
					borderWidth: 1,
					fill: false,
				},
			],
		},
		options: {
			maintainAspectRatio: false,
			scales: {
				yAxes: [
					{
						ticks: {
							beginAtZero: true,
						},
					},
				],
				xAxes: [
					{
						type: "time",
						distribution: "linear",
						time: {
							unit: timeFrames[timeFrame],
						},
						ticks: {
							autoSkip: true,
							maxTicksLimit: 10,
						},
					},
				],
			},
			events: []
		},
	});
}


// Get the value from the timeframe dropdown
function getTimeFrame() {
	return html_timeFrameDropdown.value;
}

// Get the current temperature from /api/v1/temperature-now
function getCurrentTemperature() {
	handleData(
		`http://${lanIP}/api/v1/temperature-now`,
		showTemperatuur,
		showError
	);
}

// Get the temperature from the last x hours
function getTemperature(time) {
	handleData(
		`http://${lanIP}/api/v1/temperature-${time}`,
		showChart,
		showError
	);
}

// Listen to changes from the dropdown
function listenToTimeFrame() {
	html_timeFrameDropdown.addEventListener("change", (e) => {
		getTemperature(e.target.value);
	});
	// Trigger the event once (when the page loads)
	html_timeFrameDropdown.dispatchEvent(new Event("change"));
}

