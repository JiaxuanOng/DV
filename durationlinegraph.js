// Load the CSV file
//d3.csv("StreamingPlatform.csv").then(function(data) {
  // Prepare the data
  
	var margin4 = {top: 40, right: 20, bottom: 50, left: 30};
	  var width4 = 400 - margin4.left - margin4.right;
	  var height4 = 400 - margin4.top - margin4.bottom;
  // Set up the svg4 and chart dimensions
  var svg5 = d3.select("#chart4")
  .append("svg")
	.attr("width", 400)
	.attr("height", 400)
	.append("g")
	.attr("transform", "translate(" + margin4.left + "," + margin4.top + ")");
  
  var tooltip4 = d3.select("body")
                      .append("div")
                      .attr("class", "tooltip4")
                      .style("opacity", 0);
  var nestedData;
function updateData4(data) {
	var self = this;

  function prepareData(data) {
	  
	nestedData = data.reduce(function(acc, d) {
	  var key = d.release_year;
	  var existingEntry = acc.find(function(entry) {
		return entry.release_year === key;
	  });

	  if (existingEntry) {
		if (d3.select('input[name="type"]:checked').node().value === 'Movie') {
		  if (d.Platform === d3.select('input[name="platform"]:checked').node().value && !existingEntry.titles.includes(d.title)) {
			existingEntry.durationSum += parseInt(d['Duration (min)']);
			existingEntry.titleCount++;
			existingEntry.titles.push(d.title);
		  }
		} else {
		  if (d.Platform === d3.select('input[name="platform"]:checked').node().value && !existingEntry.titles.includes(d.title)) {
			existingEntry.durationSum += parseInt(d['Duration (Season)']);
			existingEntry.titleCount++;
			existingEntry.titles.push(d.title);
		  }
		}
	  } else {
		var durationSum = 0;
		var titles = [];

		if (d3.select('input[name="type"]:checked').node().value === 'Movie') {
		  if (d.Platform === d3.select('input[name="platform"]:checked').node().value) {
			durationSum += parseInt(d['Duration (min)']);
			titles.push(d.title);
		  }
		} else {
		  if (d.Platform === d3.select('input[name="platform"]:checked').node().value) {
			durationSum += parseInt(d['Duration (Season)']);
			titles.push(d.title);
		  }
		}

		if (durationSum > 0) {
		  acc.push({
			release_year: key,
			durationSum: durationSum,
			titleCount: 1,
			titles: titles
		  });
		}
	  }

	  return acc;
	}, []);
  }

  // Filter the data based on selected options
  function filterData() {
	var selectedType = d3.select('input[name="type"]:checked').node().value;
	var selectedPlatform = d3.select('input[name="platform"]:checked').node().value;

	var filteredData = nestedData.filter(function(d) {
	  return ((selectedType === 'Movie' && d.durationSum !== 0) || (selectedType === 'TV Show' && d.durationSum !== 0 && d.durationSum !== 1));
	});

	return filteredData.sort(function(a, b) { return a.release_year - b.release_year; });
  }
  // Define scales and axes
  var x = d3.scaleTime().range([0, width4]);
  var y = d3.scaleLinear().range([height4, 0]);

  var xAxis = d3.axisBottom(x);
  var yAxis = d3.axisLeft(y);

  // Draw the line graph
  //function drawLineGraph() {
	  // Remove existing lines and circles
	prepareData(data);
	var filteredData = filterData();
	var parseTime = d3.timeParse("%Y");
	x.domain(d3.extent(filteredData, function(d) { return parseTime(d.release_year); }));
	y.domain([0, d3.max(filteredData, function(d) { return d.durationSum / d.titleCount; })]);
	// Update the line path
	var line = d3.line()
	  .x(function(d) { return x(parseTime(d.release_year)); })
	  .y(function(d) { return y(d.durationSum / d.titleCount); });

					  
					 
   svg5.selectAll(".line").remove();
     svg5.selectAll(".x-axis").remove();
		  svg5.selectAll(".y-axis").remove();
		  svg5.selectAll(".y-axis-label").remove();
		  svg5.selectAll(".dynamic-point").remove();
   
	svg5.selectAll(".line")
	  .data([filteredData]).enter()
	  .append("path")
	  .attr("class", "line")
	  //.merge(linePath)
	  //.transition()
	  //.duration(500)
	  .attr("d", line)
	  .style("stroke", d => {
		  var selectedPlatform = d3.select('input[name="platform"]:checked').node().value;
    // Add your conditions here based on the selectedPlatform and selectedType
    if (selectedPlatform === "Amazon Prime") {
      return "orange"; // set the fill color for the condition
    } 
	else if (selectedPlatform === "Netflix") {
      return "red"; // set the fill color for the condition
    }
	else if (selectedPlatform === "Disney+") {
      return "blue"; // set the fill color for the condition
    }
	else {
      return "green"; // set the fill color for other cases
    }
  })
  .style("stroke-width", "2px");
  //.on("mouseover", handleMouseOver)
  //.on("mouseout", handleMouseOut);

svg5.selectAll(".dynamic-point")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("class", "dynamic-point")
        .attr("r", 3)
        .style("fill", "red")
        .style("opacity", 0)
        .attr("cx", function(d) { return x(parseTime(d.release_year)); })
        .attr("cy", function(d) { return y(d.durationSum / d.titleCount); })
        .on("mouseover", handleMouseOver)
        .on("mouseout", handleMouseOut);
  //.attr("color", "red");  // Initial radius of 0
function handleMouseOver(event, d) {
	d3.select(this)
        .style("opacity", 1);
		
  tooltip4.style("visibility", "visible");
		tooltip4.html("");
  tooltip4.style("opacity", 0.9);
  const [x, y] = d3.pointer(event);
		// Display tooltip with country name and show count
		tooltip4
		  .style("left", (x + 650)+ "px")
		  .style("top", (y + 900 )+ "px");
  tooltip4
  //.style("left", event.pageX + "px")
        .style("width", "100")
        .style("padding", "12px")
		//.style("color", "white")
		.style("background-color", "white")
        .style("border", "4px solid #757575")
        .style("border-radius", "12px")
        .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.1)")
        .style("line-height", "1.5")
        .style("margin-bottom", "20px")
		.style("position", "absolute");

  var mouseCoordinates = d3.pointer(event);
  var mouseX = mouseCoordinates[0];
  var mouseY = mouseCoordinates[1];
  const [svgX, svgY] = d3.pointer(event, svg5.node());
 
  var index = Math.round((mouseCoordinates[0] / width4) * (filteredData.length) - 1);
  var closestDataPoint = filteredData[index];
  var averageDuration = closestDataPoint.durationSum / closestDataPoint.titleCount;
  var type = selectedType === "Movie" ? "minutes" : "seasons"
  tooltip4.style("opacity", 1)
    .html("<b><i>Year:</b></i> " + closestDataPoint.release_year + "<br><b><i>Average Duration:</b></i> " + averageDuration.toFixed(2) + " " + type)
	.style("left", (event.pageX + 10) + "px")
    .style("top", (event.pageY - 30) + "px");
}

function handleMouseOut(event, d) {
	d3.select(this)
        .style("opacity", 0);
  tooltip4.style("opacity", 0);
 
}

	// Update the y-axis label based on data type selection
	var selectedType = d3.select('input[name="type"]:checked').node().value;
	var yAxisLabel = selectedType === "Movie" ? "Average Duration (min)" : "Average Duration (season)";


  // Draw the axes
  svg5.append("g")
	.attr("class", "x-axis")
	.attr("transform", "translate(0," + height4 + ")")
	.call(xAxis);

  svg5.append("g")
	.attr("class", "y-axis")
	.call(yAxis);

  // Add y-axis label
  svg5.append("text")
	.attr("class", "y-axis-label")
	.attr("x", 0)
	.attr("y", -10)
	.attr("fill", "white")
	.attr("text-anchor", "start")
	  .text(yAxisLabel);
	
  svg5.append("text")
	  .attr("class", "x-axis-label")
	  .attr("x", width4 / 2)
	  .attr("y", height4 + margin4.bottom - 10)
	  .attr("fill", "white")
	  //.attr("text-anchor", "middle")
	  .text("Release Year");
}
