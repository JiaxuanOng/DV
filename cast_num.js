function calculateTotalCasts(data) {
    var CastTitles = new Set();
  
    data.forEach(function(d) {
        CastTitles.add(d.cast);
      });
  
    var distinctCastTitles = CastTitles.size;
    // Create an svg1 container for displaying the total movies
    var svgMV = d3
      .select("#totalCastsContainer")
      .append("svg")
      .attr("width", 170) // Set the width of the svg1 container
      .attr("height", 100); // Set the height of the svg1 container
  
    // Add text to the svg1 container
    svgMV
      .append("text")
      .attr("x", 80) // Set the x-coordinate of the text
      .attr("y", 75) // Set the y-coordinate of the text
      .text(distinctCastTitles) // Set the text content to the total movies count
      .attr("text-anchor", "middle") // Center align the text horizontally
      .style("font-size", "50px") // Set the font size
      .style("fill", "red"); // Set the text color
  }
  
  d3.csv("StreamingPlatform.csv").then(function(data) {
    calculateTotalCasts(data);
  });
  