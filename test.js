function updateChart(data) {
    const selectedYear = document.querySelector('input[name="year"]:checked').value;
  
    // Filter the data based on selected year
    const filteredData = data.filter((d) => d.release_year === selectedYear);
  
    // Count the frequency of each platform
    const platformCounts = {};
    filteredData.forEach((d) => {
      if (platformCounts[d.Platform]) {
        platformCounts[d.Platform]++;
      } else {
        platformCounts[d.Platform] = 1;
      }
    });
  
    // Prepare data for the chart
    const chartData = Object.entries(platformCounts).map(([platform, count]) => ({
      platform,
      count,
    })).filter((d) => d.count > 0); // Filter out platforms with a count of 0
  
    // Clear existing chart
    d3.select("#lineMT").html("");
  
    // Set up chart dimensions
    const margin = { top: 10, right: 10, bottom: 25, left: 55 };
    const width = 500 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;
  
    // Create SVG container
    const svgMT = d3
      .select("#lineMT")
      .append("svg")
      .attr("width", width + margin.left + margin.right + 100)
      .attr("height", height + margin.top + margin.bottom + 100)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
  
    // Set up scales
    const x = d3.scaleTime()
      .domain(d3.extent(data, (d) => d.release_year))
      .range([0, width]);
  
    const y = d3.scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.count)])
      .range([height, 0]);
  
    const color = d3.scaleOrdinal()
      .domain(chartData.map((d) => d.platform))
      .range(["#d62728", "#1f77b4", "#ff7f0e", "#2ca02c"]);
  
    // Create the line generator
    const line = d3.line()
      .x((d) => x(d.year))
      .y((d) => y(d.count))
      .defined((d) => !isNaN(d.count))
      .curve(d3.curveMonotoneX);
  
    // Transform chartData into an array of objects
    const lineData = chartData.map((d) => ({
      platform: d.platform,
      values: filteredData.map((data) => ({
        year: data.release_year,
        count: data.Platform === d.platform ? 1 : 0,
      })),
    }));
  
    const tooltipMT = d3.select("body")
      .append("div")
      .attr("class", "tooltipMT")
      .style("opacity", 0);
  
    // Add the lines
    svgMT.selectAll(".line")
    .data(lineData)
    .enter()
    .append("path")
    .attr("class", "line")
    .attr("d", d => line(d.values))
    .style("fill", "none")
    .style("stroke", d => color(d.platform))
    .style("stroke-width", "2px")
    .on("mouseover", function(event, d) {
      d3.select(this)
        .style("stroke-width", "4px");
      var mouseCoordinates = d3.pointer(event);
      var tooltipX = mouseCoordinates[0] + 1130;
      var tooltipY = mouseCoordinates[1] + 350;
      var index = Math.round((mouseCoordinates[0] / width) * (d.values.length - 1));
      var closestDataPoint = d.values[index];
      tooltipMT.style("left", tooltipX + "px")
        .style("top", tooltipY + "px")
        .style("opacity", 1)
        .text(closestDataPoint.count);
    })
    
    .on("mouseout", function(event, d) {
      // Restore the original line thickness on mouseout
      d3.select(this)
        .style("stroke-width", "2px");
    
      // Hide the tooltip
      tooltipMT.style("opacity", 0);
    });

    // Add the x-axis
    svgMT.append("g")
      .attr("class", "axis")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x)
        .ticks(d3.timeYear.every(10))
        .tickFormat(d3.timeFormat("%Y")))
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-0.8em")
      .attr("dy", "0.15em")
      .attr("transform", "rotate(-45)");

    // Add the y-axis
    svgMT.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));
}
const platformRadio = document.querySelectorAll('input[name="year"]');
platformRadio.forEach((radio) => radio.addEventListener("change", loadData));


// Load data from CSV file
function loadData() {
  const selectedYear = document.querySelector('input[name="year"]:checked').value;

  d3.csv("StreamingPlatform.csv").then((data) => {
    // Filter data based on platform and type
    const filteredData = data.filter((d) => d.release_year === selectedYear);

    // Call updateChart with the filtered data
    updateChart(filteredData);
  });
}

// Initial chart rendering
loadData();