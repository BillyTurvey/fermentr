import * as d3 from 'https://cdn.skypack.dev/d3@7';

if (fermentationHasTemperatureData()) drawGraph();

async function drawGraph() {
	const fermentationId = /[a-z0-9]{24}/.exec(window.location.pathname)[0];

	let graphData = await fetch(`/api/${fermentationId}/graph`).catch(error => {
		console.error(error.message);
		// informUserFetchRequestFailed();
	});
	const data = await graphData.json();

	const container = document.getElementsByClassName('graph-container')[0];

	const //
		height = container.clientHeight,
		width = container.clientWidth;

	const margin = {top: 20, right: 20, bottom: 30, left: 30};

	// defining the transformation the raw data has to go through to get a coordinate
	const x = d3
		.scaleTime()
		.domain([new Date(data[0].time), new Date(data[data.length - 1].time)])
		.range([margin.left, width - margin.right])
		.interpolate(d3.interpolateRound);

	// defining the transformation the raw data has to go through to get a coordinate
	const y = d3
		.scaleLinear()
		.domain([5, d3.max(data, d => d.temp) + 2])
		.nice()
		.range([height - margin.bottom, margin.top]);
	// .interpolate(d3.interpolateRound);

	// X axis label
	const xAxis = (g, x) =>
		g.attr('transform', `translate(0,${height - margin.bottom})`).call(
			d3
				.axisBottom(x)
				.ticks(width / 80)
				.tickSizeOuter(0)
		);

	// Y axis label
	const yAxis = (g, y) =>
		g
			.attr('transform', `translate(${margin.left},0)`)
			.call(d3.axisLeft(y).ticks(null, 's'))
			.call(g => g.select('.domain').remove())
			.call(g =>
				g
					.selectAll('.tick line')
					.clone()
					.attr('x2', width - margin.left - margin.right)
					.attr('stroke-opacity', 0.1)
			)
			.call(g =>
				g
					.select('.tick:last-of-type text')
					.clone()
					.attr('x', 3)
					.attr('text-anchor', 'start')
					.attr('font-weight', 'bold')
					.text(data.y)
			);

	// Creating a function that will generate the path coordinates for the line
	const line = d3
		.line()
		.curve(d3.curveBasis)
		.x(d => x(d.time))
		.y(d => y(d.temp));

	const zoom = d3
		.zoom()
		.scaleExtent([1, 32])
		.extent([
			[margin.left, 0],
			[width - margin.right, height]
		])
		.translateExtent([
			[margin.left, -Infinity],
			[width - margin.right, Infinity]
		])
		.on('zoom', zoomed);

	//defining the whole graph/SVG
	const svg = d3
		.create('svg') //
		.attr('viewBox', [0, 0, width, height]);

	const clip = {id: 'data-clip'};

	// add a clipping path to the graph to prevent the plotted data shapes spilling into the axis labels
	svg
		.append('clipPath')
		.attr('id', clip.id)
		.append('rect')
		.attr('x', margin.left)
		.attr('y', margin.top)
		.attr('width', width - margin.left - margin.right)
		.attr('height', height - margin.top - margin.bottom);

	// Inserting the line path into the chart
	const linePath = svg
		.append('path') //
		.attr('clip-path', 'url(#data-clip)')
		.attr('fill', 'none')
		.attr('stroke', 'orange')
		.attr('stroke-width', 2)
		.attr('d', line(data, x));

	// adding the axis labels
	const gx = svg.append('g').call(xAxis, x); //X
	svg.append('g').call(yAxis, y); //Y

	svg
		.call(zoom)
		.transition()
		.duration(700)
		.call(zoom.scaleTo, 1, [x(Date.UTC(2001, 8, 1)), 0]);

	function zoomed(event) {
		const xz = event.transform.rescaleX(x);

		linePath.attr(
			'd',
			d3
				.line()
				.curve(d3.curveBasis)
				.x(d => xz(d.time))
				.y(d => y(d.temp))(data)
		);

		gx.call(xAxis, xz);
	}

	container.appendChild(svg.node());
}

function fermentationHasTemperatureData() {
	if (document.getElementsByClassName('temperature').length > 0) {
		return true;
	} else {
		return false;
	}
}
