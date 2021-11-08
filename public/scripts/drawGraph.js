import * as d3 from 'https://cdn.skypack.dev/d3@7';

async function drawGraph() {
	const fermentationIdRegEx = /[a-z0-9]{24}/; //24 lowercase letter or number characters, aka mongoose
	const fermentationId = fermentationIdRegEx.exec(window.location.pathname)[0];

	let graphData = await fetch(`/api/${fermentationId}/graph`).catch(error => {
		console.error(error.message);
		// informUserFetchRequestFailed();
	});
	graphData = await graphData.json();

	const startTime = graphData[0][0];
	const endTime = graphData[graphData.length - 1][0];
	const timeRange = endTime - startTime;
	console.log(`🟠 timeRange: ${timeRange}`);

	const graph = document.getElementById('temp-graph');
	graph.append = addSVGElement;
	const height = graph.clientHeight,
		width = graph.clientWidth;
	graph.append({
		name: 'rect',
		attributes: {
			width: width,
			height: height,
			style: 'fill: #eee'
		}
	});

	// Draw graph y axis grid/scale line
	for (let i = 0; i < 10; i++) {
		graph.append({
			name: 'path',
			attributes: {
				d: `M 0 ${i * (height / 5) - 1} L ${graph.clientWidth} ${i * (height / 5) - 1}`,
				style: 'stroke: grey; stroke-width: 0.5'
			}
		});
	}

	d3.select('#temp-graph')
		.selectAll('circle')
		.data(graphData)
		.enter()
		.append('circle')
		.attr('cx', d => (d[0] - startTime) / (timeRange / width)) //time
		.attr('cy', d => height - d[1]) //temp
		.attr('r', 3)
		.attr('fill', d => `hsl(${250 + (d[1] - 12) * 15}, 100%, 50%)`)
		.attr('stroke', null);

	// graph.onscroll(function zoomGraph(e) {});
}

drawGraph();

//=========================================================================================================================================================================

function addSVGElement(element) {
	const newElement = document.createElementNS('http://www.w3.org/2000/svg', element.name);
	for (const key in element.attributes) {
		newElement.setAttribute(key, element.attributes[key]);
	}
	this.appendChild(newElement);
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
