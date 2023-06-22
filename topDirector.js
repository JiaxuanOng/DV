// Set up the chart dimensions
const chartWidth2 = 400;
const chartHeight2 = 400;
const barHeight2 = 40;
const margin2 = { top: 50, right: 20, bottom: 40, left: 120 };

// Create the SVG container
const svg3 = d3.select("#chart2")
  .attr("width", chartWidth2)
  .attr("height", chartHeight2)
  .attr("class", "svg-container")
  .attr("pointer-events", "all");
  
  
const tooltip3 = d3
  .select("body")
  .append("div")
  .attr("class", "tooltip3")
  .style("opacity", 0);

function showTooltip(content, x, y) {
  tooltip3
    .style("opacity", 1)
    .style("left", `${x}px`)
    .style("top", `${y}px`)
    .html(content);
}



// Read the CSV file and generate the chart
//d3.csv("StreamingPlatform.csv").then(function(data) {
  // Define the function to update the chart based on the selected filters
  function updateChart2(data) {
	  function hideTooltip() {
  tooltip3.style("opacity", 0);
  d3.select(this).attr("opacity", 1); // Reset the opacity on mouseout
}
	const selectedPlatform = document.querySelector('input[name="platform"]:checked').value;
	const selectedType = document.querySelector('input[name="type"]:checked').value;

	// Filter the data by platform and type
	const filteredData = data.filter(item => item.Platform === selectedPlatform && item.type === selectedType && item.director !== "Unknown");

	// Group and aggregate the data by director
	const directorsData = [];
	filteredData.forEach(movie => {
	  const directorEntry = directorsData.find(entry => entry.director === movie.director);
	  if (directorEntry) {
		if (!directorEntry.titles.includes(movie.title)) {
		  directorEntry.count += 1;
		  directorEntry.titles.push(movie.title);
		  directorEntry.genres.push(movie.listed_in);
		}
	  } else {
		directorsData.push({
		  director: movie.director,
		  count: 1,
		  titles: [movie.title],
		  genres: [movie.listed_in]
		});
	  }
	});

	// Sort the data in descending order based on the count of distinct titles
	directorsData.sort((a, b) => b.count - a.count);

	// Select the top 3 directors
	const topThreeDirectors = directorsData.slice(0, 10);

	// Create the scales
	const xScale = d3.scaleLinear()
	  .domain([0, d3.max(topThreeDirectors, d => d.count)])
	  .range([margin2.left, chartWidth2 - margin2.right]);

	const yScale = d3.scaleBand()
	  .domain(topThreeDirectors.map(d => d.director))
	  .range([margin2.top, chartHeight2 - margin2.bottom])
	  .padding(0.1);

	// Create the bars
	svg3.selectAll("rect").remove(); // Clear previous bars
	svg3.selectAll("rect")
	  .data(topThreeDirectors)
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
	  .attr("x", margin2.left)
	  .attr("y", d => yScale(d.director))
	  .attr("width", d => xScale(d.count) - margin2.left)
	  .attr("height", yScale.bandwidth())
	  .on("mouseover", handleMouseOver)
	  .on("mouseout", hideTooltip);
	  
	function handleMouseOver(event, d) {
    d3.select(this).attr("opacity", 0.7);
	tooltip3.style("visibility", "visible");
		tooltip3.html("");
  tooltip3.style("opacity", 0.9);
  const [x, y] = d3.pointer(event);
		// Display tooltip with country name and show count
		tooltip3
		  .style("left", (x + 100)+ "px")
		  .style("top", (y + 800)+ "px");
  tooltip3
        .style("width", "200")
        .style("padding", "12px")
        .style("border", "4px solid #757575")
        .style("border-radius", "12px")
        .style("box-shadow", "0 2px 4px rgba(0, 0, 0, 0.1)")
        .style("line-height", "1.5")
        .style("margin-bottom", "20px");

  // Create the SVG container for the bar chart
  const margin = { top: 40, right: 10, bottom: 60, left: 40 };
  const graphWidth = 380- margin.left - margin.right;
  const graphHeight = 360  - margin.top - margin.bottom;
  const graphSvg = tooltip3.append("svg")
    .attr("width", 380)
    .attr("height", 360);

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
	
		
		 graphSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", graphWidth / 2+ graphWidth/8)
        .attr("y", margin.top - 27)
        .attr("text-anchor", "middle")
        .text("Genre Overview of the Directors")
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

}
svg3
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
  
  svg3
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

svg3
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
svg3
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


	function handleMouseOut(event, d) {
	  hideTooltip;
    }

	// Create the axes
	const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
	const yAxis = d3.axisLeft(yScale);
	
	 if (xScale.domain() [1] < 10) {
            xAxis.ticks(xScale.domain()[1])
        }

	svg3.select(".x-axis").remove(); // Clear previous x-axis
	svg3.select(".y-axis").remove(); // Clear previous y-axis

	svg3.append("g")
	  .attr("class", "x-axis")
	  .attr("transform", `translate(0, ${chartHeight2 - margin2.bottom})`)
	  .call(xAxis)
	  .append("text")
	  .attr("class", "x-label")
	  .attr("x", chartWidth2 / 2 + chartWidth2 / 8)
	  .attr("y", margin2.bottom - 5)
	  .attr("fill", "white")
	  .attr("text-anchor", "middle")
	  //.attr("transform", "rotate(-90)")
	  .text(selectedType === "Movie" ? "Count of Movies" : "Count of TV Shows");

	svg3.append("g")
	  .attr("class", "y-axis")
	  .attr("transform", `translate(${margin2.left}, 0)`)
	  .call(yAxis)
	  .append("text")
	  .attr("fill", "white")
	  .attr("class", "y-label")
    .attr("text-anchor", "start")
	.attr("x", -20)
	//.attr("y", -10)
    .attr("y", 25)
    .attr("dy", ".75em")
    //.attr("transform", "rotate(-90)")
    .text("Director Name");
  }

  // Add event listeners to the radio buttons
  /*const platformRadioButtons = document.querySelectorAll('input[name="platform"]');
  platformRadioButtons.forEach(button => {
	button.addEventListener("change", updateChart2);
  });

  const typeRadioButtons = document.querySelectorAll('input[name="type"]');
  typeRadioButtons.forEach(button => {
	button.addEventListener("change", updateChart2);
  });

  // Initialize the chart
  updateChart2();
}).catch(function(error) {
  // Handle any errors that occur during the data loading
  console.log(error);
});*/

/* Attach event listeners to radio buttons
const platformRadio = document.querySelectorAll('input[name="platform"]');
platformRadio.forEach((radio) => radio.addEventListener("change", loadData));

const typeRadio = document.querySelectorAll('input[name="type"]');
typeRadio.forEach((radio) => radio.addEventListener("change", loadData));

// Load data from CSV file
function loadData() {
  const selectedPlatform = document.querySelector('input[name="platform"]:checked').value;
  const selectedType = document.querySelector('input[name="type"]:checked').value;

  d3.csv("StreamingPlatform.csv").then((data) => {
    // Filter data based on platform and type
    const filteredData = data.filter((d) => d.Platform === selectedPlatform && d.type === selectedType);

    // Call updateChart with the filtered data
    updateChart2(filteredData);
  });
}

// Initial chart rendering
loadData();*/
