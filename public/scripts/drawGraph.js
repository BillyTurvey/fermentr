import * as d3 from 'https://cdn.skypack.dev/d3@7';

async function drawGraph() {
	const fermentationIdRegEx = /[a-z0-9]{24}/; //24 lowercase letter or number characters, aka mongoose
	const fermentationId = fermentationIdRegEx.exec(window.location.pathname)[0];

	let graphData = await fetch(`/api/${fermentationId}/graph`).catch(error => {
		console.error(error.message);
		// informUserFetchRequestFailed();
	});
	graphData = await graphData.json();

	//select graph
	const graph = document.getElementById('temp-graph');
	graph.append = addSVGElement;

	const //
		graphHeight = graph.clientHeight,
		graphWidth = graph.clientWidth,
		startTime = graphData[0][0],
		endTime = graphData[graphData.length - 1][0],
		timeRange = endTime - startTime,
		tempMinMax = getMinMax(graphData),
		tempRange = tempMinMax.max - tempMinMax.min,
		//The temperature range of the graph is 125% the range of the temp data
		yAxisTempRange = tempRange * 1.25,
		pixelsPerDegreeC = graphHeight / yAxisTempRange,
		yAxisMin = tempMinMax.min - tempRange / 8; //there is a margin of 12.5% (1/8th) of the tempRange below the lowest reading on the y axis

	function convertTempToYAxisValue(normalTemperatureValue) {
		const //
			yValueDegreesC = normalTemperatureValue - yAxisMin,
			yValuePx = yValueDegreesC * pixelsPerDegreeC;
		return yValuePx;
	}

	//add background
	graph.append({
		name: 'rect',
		attributes: {
			width: graphWidth,
			height: graphHeight,
			style: 'fill: #eee'
		}
	});

	// Draw graph y axis grid/scale line
	for (let i = 0; i < 10; i++) {
		graph.append({
			name: 'path',
			attributes: {
				d: `M 0 ${i * (graph.clientHeight / 5) - 1} L ${graph.clientWidth} ${
					i * (graph.clientHeight / 5) - 1
				}`,
				style: 'stroke: grey; stroke-width: 0.5'
			}
		});
	}

	//plot data on graph
	d3.select('#temp-graph')
		.selectAll('circle')
		.data(graphData)
		.enter()
		.append('circle')
		.attr('cx', d => (d[0] - startTime) / (timeRange / graphWidth)) //time
		.attr('cy', d => graphHeight - convertTempToYAxisValue(d[1])) //temp
		.attr('r', 1)
		.attr('fill', d => `hsl(${250 + (d[1] - 12) * 15}, 100%, 50%)`)
		.attr('stroke', null);
}

if (document.getElementById('temp-graph')) drawGraph();

//=========================================================================================================================================================================

function addSVGElement(element) {
	const newElement = document.createElementNS('http://www.w3.org/2000/svg', element.name);
	for (const key in element.attributes) {
		newElement.setAttribute(key, element.attributes[key]);
	}
	this.appendChild(newElement);
}

function getMinMax(logArr) {
	return logArr.reduce(
		(prev, curr) => {
			return {
				min: curr[1] < prev.min ? curr[1] : prev.min,
				max: curr[1] > prev.max ? curr[1] : prev.max
			};
		},
		{min: logArr[0][1], max: logArr[0][1]}
	);
}

// const sum = (previous, current) => previous + current[1];
// const meanTemp = graphData.reduce((previous, current) => {previous + current[1]}, 0) / graphData.length;

//ASAP a fetch request should grap an overview of the fermentation's thermal profile to date AND the target thermal profile if it has one too
// if there's a thermal profile, the graph width should be the length of the planned fermentation length
// if the fermentation has no planned profile the width of the graph should be the width of the time elapsed
// the graph should be the full width of the useable screen

/*
		Thinking out loud...
		we need the array of time series thermal data to draw the graph. Easy enough to fetch.

		To draw the graph:
		- Work out the overal scale:
			- The x axis total length will vary depending on how much data has been collected. Perhaps it will be 110%? of the length of the data recorded. x = 0 = yeast pitch time || the first temp measurement
			- The data line should be in the middle of the y axis. 
				- The middle of the y axis should be the mean y value of all datapoints
			- The range of the data shown on the y axis is to be determined, try either 0-50•C or the range of the y values +- 100-200% either side? 

		- Draw a rectangle to fill the alloted space on the page
			- Y max = y * 1.2

		- Problem: Data can not assumed to be equally distanced along the x axis, the device may have been unplugged for a short while or it may not have been able to connect to the wifi. Data are mostly one minute apart but not always.
			- grab the range in time and devide it by the number of pixels available in the x axis in the alloted area to get the time period that each pixel width on the x axis represents.
			- if there are more pixels than data then the 
			- for each pixel work out the mean of all the temps measured during that time period, this gives a new array of y values for each pixel.
	*/
