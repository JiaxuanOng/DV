function calculateTotalTVs(data) {
    var tvTitles = new Set();
  
    data.forEach(function(d) {
      if (d.type === "TV Show") {
        tvTitles.add(d.title);
      }
    });
  
    var distinctTVTitles = tvTitles.size;
  
    // Create an svg2 container for displaying the total movies
    var svgTV = d3
      .select("#totalTVsContainer")
      .append("svg")
      .attr("width", 170) // Set the width of the svg2 container
      .attr("height", 100); // Set the height of the svg2 container
  
    // Add text to the svg2 container
    svgTV
      .append("text")
      .attr("x", 90) // Set the x-coordinate of the text
      .attr("y", 75) // Set the y-coordinate of the text
      .text(distinctTVTitles) // Set the text content to the total movies count
      .attr("text-anchor", "middle") // Center align the text horizontally
      .style("font-size", "50px") // Set the font size
      .style("fill", "#f5f7f5"); // Set the text color
  }
  
  d3.csv("StreamingPlatform.csv").then(function(data) {
    calculateTotalTVs(data);
  });
  