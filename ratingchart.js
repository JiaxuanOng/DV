const transitionDuration = 2000; // Transition duration in milliseconds
//const transition = d3.transition().duration(transitionDuration);

function updateChart1(data) {
  const selectedPlatform = document.querySelector('input[name="platform"]:checked').value;
  const selectedType = document.querySelector('input[name="type"]:checked').value;

  // Filter the data based on selected platform and type
  const filteredData = data.filter((d) => d.Platform === selectedPlatform && d.type === selectedType);

  // Calculate ratings for non-repeated titles
  const uniqueTitles = {};
  filteredData.forEach((d) => {
    const key = d.title.toLowerCase();
    if (!uniqueTitles[key]) {
      uniqueTitles[key] = d.rating;
    }
  });

  // Count the ratings
  const ratingCounts = {};
  Object.values(uniqueTitles).forEach((rating) => {
    if (ratingCounts[rating]) {
      ratingCounts[rating]++;
    } else {
      ratingCounts[rating] = 1;
    }
  });

  // Prepare data for the chart
  const chartData = Object.entries(ratingCounts).map(([rating, count]) => ({
    rating,
    count,
  }))
  .filter((d) => d.count > 0); // Filter out ratings with a count of 0;

  // Clear existing chart
  d3.select("#chart3").html("");

  // Set up chart dimensions
  const margin = { top: 30, right: 20, bottom: 70, left: 60 };
  const width = 550 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create SVG element
  const svg4 = d3
    .select("#chart3")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  // Define scales
  const xScale = d3
    .scaleBand()
    .range([0, width])
    .domain(chartData.map((d) => d.rating))
    .padding(0.2);

  const yScale = d3.scaleLinear().range([height, 0]).domain([0, d3.max(chartData, (d) => d.count)]);

  // Draw bars
  svg4.selectAll("rect").remove();
  svg4.selectAll(".bar").remove();
  svg4
    .selectAll(".bar")
    .data(chartData)
	.enter()
	//.transition(transition)
	//.transition() // <---- Here is the transition
    //.duration(transitionDuration) // 2 seconds
    .append("rect")
    .attr("class", "bar")
    .attr("x", (d) => xScale(d.rating))
    .attr("width", xScale.bandwidth())
    .attr("y", (d) => yScale(d.count))
    .attr("height", (d) => height - yScale(d.count))
	//.attr("fill", function(d) {
    //return "rgb(0, 0, " + (d * 10) + ")";
	//});
    .attr("fill", d => {
    // Add your conditions here based on the selectedPlatform and selectedType
    if (selectedPlatform === "Amazon Prime") {
      return "url(#gradient-orange)"; // set the fill color for the condition
    } 
	else if (selectedPlatform === "Netflix") {
      return "url(#gradient-red)"; // set the fill color for the condition
    }
	else if (selectedPlatform === "Disney Plus") {
      return "url(#gradient-blue)"; // set the fill color for the condition
    }
	else {
      return "url(#gradient-green)"; // set the fill color for other cases
    }
  })
  .on("mouseover", function (event, d) {
    d3.select(this).attr("opacity", 0.7); // Change the opacity on mouseover
    // Add tooltip or other visual indication here
  })
  .on("mouseout", function (event, d) {
    d3.select(this).attr("opacity", 1); // Reset the opacity on mouseout
    // Remove tooltip or other visual indication here
  })
  .on("click", function (event, d) {
    // Handle click event, e.g., display more information about the bar
  })
  .transition() // <---- Here is the transition
    .duration(2000); // 2 seconds;
// Create gradient for orange color
svg4
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
  
  svg4
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

svg4
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
svg4
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


	
	svg4.selectAll("text")
   .data(chartData)
   .enter()
   .append("text")
   .attr("text-anchor", "middle")
   .text(function(d) {
        return d.count;
   })
   .attr("fill", "white")
   .attr("font-size", "14px")

   .attr("x", function(d, i) {
        return i * (width / chartData.length) + 20;  // +5
   })
   .attr("y", function(d) {
        return margin.bottom + yScale(d.count) - 73;              // +15
   });
   
   
  // Add x-axis
  svg4
    .append("g")
    .attr("transform", `translate(0, ${height})`)
	.transition() // Add transition for x-axis
  .duration(transitionDuration)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-45)");
	  
	  
	 svg4.append("g").append("text")
	  .attr("class", "x-axis-label")
	  .attr("x", width / 2 - width / 8)
	  .attr("y", height + margin.bottom -5)
	  .attr("fill", "white")
	  //.attr("text-anchor", "middle")
	  .transition() // Add transition for x-axis label
  .duration(transitionDuration)
	  .text("Rating Type");

  // Add y-axis
  svg4.append("g").call(d3.axisLeft(yScale))
  .transition() // Add transition for x-axis
  .duration(transitionDuration);

	svg4.append("g").append("text")
	  .attr("class", "y-axis-label")
	  .attr("x", -25)
	  .attr("y", -30)
	  .attr("dy", ".75em")
	  .attr("fill", "white")
	  //.attr("text-anchor", "middle")
	  .transition() // Add transition for x-axis label
  .duration(transitionDuration)
	  .text(selectedType === "Movie" ? "Count of Movies" : "Count of TV Shows");
}

// Attach event listeners to radio buttons
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
    updateChart1(filteredData);
	updateChart2(filteredData);
	updateChart3(filteredData);
	updateData4(filteredData);
  });
}

// Initial chart rendering
loadData();
