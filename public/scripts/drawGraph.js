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

	const viewBox = {
		x: 0,
		y: 0,
		width: (timeRange / 60000) * 1.1,
		height: 50
	};

	const graph = document.getElementById('temp-graph');
	graph.setAttribute('viewBox', `${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`);

	// Draw graph grid/scale
	const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	line.setAttribute('d', `M 0 20 L ${viewBox.width} 20`);
	line.setAttribute('style', 'stroke: grey; stroke-width: 2');
	console.log(line);
	graph.appendChild(line);

	const svg = d3
		.select('#temp-graph')
		.selectAll('circle')
		.data(graphData)
		.enter()
		.append('circle')
		.attr('cx', d => (d[0] - startTime) / 60000) //time
		.attr('cy', d => (d[1] - 15) * 100) //temp
		.attr('r', 20)
		.attr('fill', d => `hsl(${250 + (d[1] - 12) * 15}, 100%, 50%)`)
		.attr('stroke', null);

	// graph.onscroll(function zoomGraph(e) {});
}

drawGraph();

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
