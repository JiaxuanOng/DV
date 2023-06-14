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
    var width = 420 - margin.left - margin.right;
    var height = 350 - margin.top - margin.bottom;

    // Create the SVG container
    var svg = d3.select("#lineMT")
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


    var color = d3.scaleOrdinal(d3.schemeCategory10)
                  .domain(platforms);

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

// Add the lines
// Add the lines
svg.selectAll(".line")
  .data(lineData)
  .enter()
  .append("path")
  .attr("class", "line")
  .attr("d", d => line(d.values))
  .style("fill", "none")
  .style("stroke", d => color(d.platform))
  .style("stroke-width", "2px")
  .on("mouseover", function(event, d) {
    // Increase the line thickness on hover
    d3.select(this)
      .style("stroke-width", "4px");
  })
  .on("mouseout", function(event, d) {
    // Restore the original line thickness on mouseout
    d3.select(this)
      .style("stroke-width", "2px");
  });

// Add the x-axis
svg.append("g")
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
svg.append("g")
  .attr("class", "axis")
  .call(d3.axisLeft(y));


//     // Calculate the legend position
// var legendWidth = 100; // Adjust the width of the legend as desired
// var legendHeight = platforms.length * 20; // Adjust the height of the legend as desired
// var legendX = (width - legendWidth) / 2;
// var legendY = (legendHeight) / 2;

// // Add the legend
// var legend = svg.selectAll(".legend")
//   .data(platforms)
//   .enter()
//   .append("g")
//   .attr("class", "legend")
//   .attr("transform", (d, i) => "translate(" + legendX + "," + (legendY + i * 20) + ")"); // Adjust the legend position

// legend.append("rect")
//   .attr("x", 0)
//   .attr("width", 18)
//   .attr("height", 18)
//   .style("fill", d => color(d));

// legend.append("text")
//   .attr("x", 24)
//   .attr("y", 9)
//   .attr("dy", ".35em")
//   .style("text-anchor", "start")
//   .text(d => d);

});