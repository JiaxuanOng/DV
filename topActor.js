// Set up the chart dimensions
const chartWidth = 400;
const chartHeight = 400;
const barHeight = 40;
const margin = { top: 50, right: 20, bottom: 40, left: 120 };

// Create the svg2 container
//const svg2 = d3.select("#chart")
  //.attr("width", chartWidth)
  //.attr("height", chartHeight);
  
const svg2 = d3
  .select("#chart")
  .attr("width", chartWidth)
  .attr("height", chartHeight)
  .attr("class", "svg-container")
  .attr("pointer-events", "all");
  
//const tooltip2 = d3.select("#tooltip");

const tooltip2 = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip2")
  .style("opacity", 0);

function showTooltip(content, x, y) {
  tooltip2
    .style("opacity", 1)
    .style("left", `${x}px`)
    .style("top", `${y}px`)
    .html(content);
}


// Read the CSV file and generate the chart
//d3.csv("StreamingPlatform.csv").then(function(data) {
  // Define the function to update the chart based on the selected filters
  function updateChart3(data) {
	  function hideTooltip() {
  tooltip2.style("opacity", 0);
  d3.select(this).attr("opacity", 1);
}
	const selectedPlatform = document.querySelector('input[name="platform"]:checked').value;
	const selectedType = document.querySelector('input[name="type"]:checked').value;

	// Filter the data by platform, type, and exclude unknown directors
	const filteredData = data.filter(item => item.Platform === selectedPlatform && item.type === selectedType && item.cast !== "Unknown");

	// Group and aggregate the data by cast members
	const castData = [];
	filteredData.forEach(movie => {
	  const castEntry = castData.find(entry => entry.cast === movie.cast);
	  if (castEntry) {
		if (!castEntry.titles.includes(movie.title)) {
		  castEntry.count += 1;
		  castEntry.titles.push(movie.title);
		  castEntry.genres.push(movie.listed_in);
		}
	  } else {
		castData.push({
		  cast: movie.cast,
		  count: 1,
		  titles: [movie.title],
		  genres: [movie.listed_in]
		});
	  }
	});

	// Sort the data in descending order based on the count of distinct titles
	castData.sort((a, b) => b.count - a.count);

	// Select the top 3 cast members
	const topThreeCast = castData.slice(0, 10);

	// Create the scales
	const xScale = d3.scaleLinear()
	  .domain([0, d3.max(topThreeCast, d => d.count)])
	  .range([margin.left, chartWidth - margin.right]);
	//console.log(topThreeCast)

	const yScale = d3.scaleBand()
	  .domain(topThreeCast.map(d => d.cast))
	  .range([margin.top, chartHeight - margin.bottom])
	  .padding(0.1);

	/* Create the bars
	svg2.selectAll("rect").remove(); // Clear previous bars
	svg2.selectAll("rect")
	  .data(topThreeCast)
	  .enter()
	  .append("rect")
	  .attr("fill", "white")
	  .attr("x", margin.left)
	  .attr("y", d => yScale(d.cast))
	  .attr("width", d => xScale(d.count) - margin.left)
	  .attr("height", yScale.bandwidth());
	  
	*/
	svg2.selectAll("rect").remove();
	svg2
  .selectAll("rect")
  .data(topThreeCast)
  .enter()
  .append("rect")
  .attr("fill", d => {    
    // Add your conditions here based on the selectedPlatform and selectedType
    if (selectedPlatform === "Amazon Prime") {
      return "url(#gradient-orange)"; // set the fill color for the condition
    } 
	else if (selectedPlatform === "Netflix") {
      return "url(#gradient-red)"; // set the fill color for the condition
    }
	else if (selectedPlatform === "Disney+") {
      return "url(#gradient-blue)"; // set the fill color for the condition
    }
	else {
      return "url(#gradient-green)"; // set the fill color for other cases
    }
  })
  .attr("x", margin.left)
  .attr("y", d => yScale(d.cast))
  .attr("width", d => xScale(d.count) - margin.left)
  .attr("height", yScale.bandwidth())
.on("mouseover", handleMouseOver)
.on("mouseout", hideTooltip);
function handleMouseOver(event, d) {
	d3.select(this).attr("opacity", 0.7);
	tooltip2.style("visibility", "visible");
		tooltip2.html("");
  tooltip2.style("opacity", 0.9);
  const [x, y] = d3.pointer(event);
		// Display tooltip with country name and show count
		tooltip2
		  .style("left", (x + 500)+ "px")
		  .style("top", (y + 800)+ "px");
  tooltip2
  //.style("left", event.pageX + "px")
        .style("width", "200")
        .style("padding", "12px")
        .style("border", "4px solid #757575")
        .style("border-radius", "12px")
        .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.1)")
        .style("line-height", "1.5")
        .style("margin-bottom", "10px");

  // Create a nested selection for the tooltip content
  //const tooltipContent = tooltip2.append("div").style("display", "flex");

  // Add the cast name to the tooltip
  //tooltipContent
    //.append("div")
    //.style("font-weight", "bold")
    //.text("Cast: " + d.cast);

  // Create the SVG container for the bar chart
  const margin = { top: 40, right: 10, bottom: 60, left: 50 };
  const graphWidth = 300- margin.left - margin.right;
  const graphHeight = 350  - margin.top - margin.bottom;
  const graphSvg = tooltip2.append("svg")
    .attr("width", 300)
    .attr("height", 350);

  // Extract the genre data for the selected cast
  const genreData = d.genres.reduce((acc, genre) => {
    const genreEntry = acc.find(entry => entry.genre === genre);
    if (genreEntry) {
      genreEntry.count += 1;
    } else {
      acc.push({ genre, count: 1 });
    }
    return acc;
  }, []);

  // Create scales for the bar chart
  const xScale = d3.scaleBand()
    .domain(genreData.map(d => d.genre))
    .range([0, graphWidth])
    .padding(0.1);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(genreData, d => d.count)])
    .range([graphHeight, 0]);
	
  var chart = graphSvg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Create the bars in the bar chart
  chart.selectAll("rect")
    .data(genreData)
    .enter()
    .append("rect")
	.attr("class", "bar-label")
    .attr("x", d => xScale(d.genre))
    .attr("y", d => yScale(d.count))
    .attr("width", xScale.bandwidth())
    .attr("height", d => graphHeight - yScale(d.count))
    .attr("fill", d => {
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
  });
	
		chart.selectAll(".bar-label")
        .data(genreData)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("y", (d) => x(d.count) + 5)
        .attr("x", (d) => y(d.genre) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text((d) => d.count)
        .style("font-size", "10px")
        .attr("fill", "black");
	
	/*graphSvg.selectAll("text")
        .data(genreData)
        .enter()
        .append("text")
        .attr("class", "bar-label")
		.attr("x", (d) => xScale(d.genre) + xScale.bandwidth() / 2)
        .attr("y", (d) => yScale(d.count) + 5)
        .attr("dy", "0.35em")
        .text((d) => d.count)
        .style("font-size", "10px")
        .attr("fill", "black");*/
		
		 graphSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", graphWidth / 2 + graphWidth/8)
        .attr("y", margin.top-30)
        .attr("text-anchor", "middle")
        .text("Genre Count for Cast")
        .style("font-size", "15px")
        .attr("fill", "black");


  // Create the x-axis for the bar chart
  const xAxis = d3.axisBottom(xScale);
  chart.append("g")
	.attr("class", "x-axis")
    .attr("transform", `translate(0, ${graphHeight})`)
    .call(xAxis)
    .selectAll("text")
    .attr("transform", "rotate(-20)")
    .style("text-anchor", "end");
	chart.append("text")
	  .attr("class", "x-label")
	  .attr("x", graphWidth/2)
	  .attr("y", margin.top + graphHeight + 20)
	  .attr("text-anchor", "middle")
	  //.attr("transform", "rotate(-90)")
	  .text("Genre")
	  .attr("fill", "black")
	  .style("font-size", "15px");
  // Create the y-axis for the bar chart
// Create the y-axis for the bar chart
  const yAxis = d3.axisLeft(yScale);
  chart.append("g")
  .attr("class", "y-axis")
    .call(yAxis)
	.append("text")
	  .attr("fill", "black")
    .attr("class", "y-label")
    .attr("text-anchor", "start")
	.attr("x",-10)
	//.attr("y", -10)
    .attr("y", -15)
    .attr("dy", ".75em")
    //.attr("transform", "rotate(-90)")
    .text("Count");
	

  // Position the tooltip based on the mouse event
  //tooltip2
    //.style("left", event.pageX  + "px")
    //.style("top", event.pageY + "px");
}


	function handleMouseOut(event, d) {
	  hideTooltip;
    }
svg2
  .append("defs")
  .append("linearGradient")
  .attr("id", "gradient-orange")
  .attr("gradientTransform", "rotate(90)")
  .selectAll("stop")
  .data([
    { offset: "0%", color: "#FFC07F" },
    { offset: "100%", color: "#FF7F00" },
  ])
  .enter()
  .append("stop")
  .attr("offset", (d) => d.offset)
  .attr("stop-color", (d) => d.color);	
  
  svg2
  .append("defs")
  .append("linearGradient")
  .attr("id", "gradient-red")
  .attr("gradientTransform", "rotate(90)")
  .selectAll("stop")
  .data([
    { offset: "0%", color: "#FF0000" },
    { offset: "100%", color: "#800000" },
  ])
  .enter()
  .append("stop")
  .attr("offset", (d) => d.offset)
  .attr("stop-color", (d) => d.color);

svg2
  .append("defs")
  .append("linearGradient")
  .attr("id", "gradient-green")
  .attr("gradientTransform", "rotate(90)")
  .selectAll("stop")
  .data([
    { offset: "0%", color: "#00FF00" },
    { offset: "100%", color: "#008000" },
  ])
  .enter()
  .append("stop")
  .attr("offset", (d) => d.offset)
  .attr("stop-color", (d) => d.color);
svg2
  .append("defs")
  .append("linearGradient")
  .attr("id", "gradient-blue")
  .attr("gradientTransform", "rotate(90)")
  .selectAll("stop")
  .data([
    { offset: "0%", color: "#0000FF" },
    { offset: "100%", color: "#000080" },
  ])
  .enter()
  .append("stop")
  .attr("offset", (d) => d.offset)
  .attr("stop-color", (d) => d.color);

	// Create the axes
	const xAxis = d3.axisBottom(xScale);
	const yAxis = d3.axisLeft(yScale);
	if (xScale.domain() [1] < 10) {
            xAxis.ticks(xScale.domain()[1])

            // 2 ticks
            //yAxis.tickValues(y.domain());
        }

	svg2.select(".x-axis").remove(); // Clear previous x-axis
	svg2.select(".y-axis").remove(); // Clear previous y-axis

	svg2.append("g")
	  .attr("class", "x-axis")
	  .attr("transform", `translate(0, ${chartHeight - margin.bottom})`)
	  .call(xAxis)
	  .append("text")
	  .attr("class", "x-label")
	  .attr("x", chartWidth / 2 + chartWidth / 8)
	  .attr("y",  margin.bottom - 5)
	  .attr("fill", "white")
	  .attr("text-anchor", "middle")
	  //.attr("transform", "rotate(-90)")
	  .text(selectedType === "Movie" ? "Count of Movies" : "Count of TV Shows");

	svg2.append("g")
	  .attr("class", "y-axis")
	  .attr("transform", `translate(${margin.left}, 0)`)
	  .call(yAxis)
	  .append("text")
	  .attr("fill", "white")
    .attr("class", "y-label")
    .attr("text-anchor", "start")
	.attr("x", -25)
	//.attr("y", -10)
    .attr("y", 25)
    .attr("dy", ".75em")
    //.attr("transform", "rotate(-90)")
    .text("Cast Name");
	

	
	
	
  }

  // Add event listeners to the radio buttons
 /* const platformRadioButtons = document.querySelectorAll('input[name="platform"]');
  platformRadioButtons.forEach(button => {
	button.addEventListener("change", updateChart);
  });

  const typeRadioButtons = document.querySelectorAll('input[name="type"]');
  typeRadioButtons.forEach(button => {
	button.addEventListener("change", updateChart);
  });

  // Initialize the chart
  updateChart();
}).catch(function(error) {
  // Handle any errors that occur during the data loading
  console.log(error);
});*/