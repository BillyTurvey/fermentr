import * as d3 from 'https://cdn.skypack.dev/d3@7';

if (document.getElementById('temp-graph')) drawGraph();

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
		return graphHeight - yValuePx;
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
	for (let i = Math.floor(yAxisMin); i < yAxisMin + yAxisTempRange; i++) {
		const colour = i % 5 === 0 ? '#bbb' : '#ddd';
		const y = convertTempToYAxisValue(i);
		graph.append({
			name: 'line',
			attributes: {
				x1: 0,
				y1: y,
				x2: graph.clientWidth,
				y2: y,
				style: `stroke: ${colour}; stroke-width: 1`
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
		.attr('cy', d => convertTempToYAxisValue(d[1])) //temp
		.attr('r', 2)
		.attr('fill', d => `hsl(${120 - (d[1] - 19.8) * 30}, 100%, 40%)`)
		.attr('stroke', null);
}

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
