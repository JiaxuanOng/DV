d3.csv("StreamingPlatform.csv").then(function(data) {
    // Parse the release year as a date
    var parseDate = d3.timeParse("%Y");
    data.forEach(function(d) {
        d.release_year = parseDate(d.release_year);
    });

  data.forEach(function(d) {
  d.release_year = +d.release_year;
  });

  // Sort the data by release year for each platform
data.sort(function(a, b) {
  return a.release_year - b.release_year;
});

  // Count the total frequency of all types for each release year and platform
  var countedData = d3.rollup(data, v => v.length, d => d.release_year, d => d.Platform);

    // Extract the unique platforms from the data
    var platforms = Array.from(new Set(data.map(d => d.Platform)));

    // Set up the chart dimensions
    var margin = {top: 10, right: 10, bottom: 25, left: 55};
    var width = 500 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    // Create the SVG container
    var svgMT = d3.select("#lineMT")
                .append("svg")
                .attr("width", width + margin.left + margin.right+100)
                .attr("height", height + margin.top + margin.bottom+100)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up the scales
    var x = d3.scaleTime()
              .domain(d3.extent(data, d => d.release_year))
              .range([0, width]);

   // Set up the scales
    var y = d3.scaleLinear()
    .domain([0, d3.max(Array.from(countedData.values(), p => d3.max(Array.from(p.values()))))])

        .range([height, 0]);

    var color = d3.scaleOrdinal()
      .domain(["Netflix",  "Disney+","Amazon Prime", "Hulu"])
      .range(["#d62728", "#1f77b4", "#ff7f0e","#2ca02c"]);
  
    // Create the line generator
    var line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.count))
    .defined(d => !isNaN(d.count))
    .curve(d3.curveMonotoneX); // Exclude undefined or NaN values

    // Transform countedData into an array of arrays
    var lines = platforms.map(platform => {
      return Array.from(countedData, ([year, types]) => {
      return {
      year: year,
      count: types.get(platform) || 0
      };
    });
    });

    // Transform lines into an array of objects
    var lineData = platforms.map((platform, i) => {
      return {
      platform: platform,
      values: lines[i]
    };
    });

    var tooltipMT = d3.select("body")
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
        .html("<b><i>Number of Count:</b></i> " + closestDataPoint.count);
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

});