function calculateTotalMovies(data) {
    var movieTitles = new Set();
  
    data.forEach(function(d) {
      if (d.type === "Movie") {
        movieTitles.add(d.title);
      }
    });
  
    var distinctMovieTitles = movieTitles.size;
    // Create an svg1 container for displaying the total movies
    var svgMV = d3
      .select("#totalMoviesContainer")
      .append("svg")
      .attr("width", 170) // Set the width of the svg1 container
      .attr("height", 100); // Set the height of the svg1 container
  
    // Add text to the svg1 container
    svgMV
      .append("text")
      .attr("x", 80) // Set the x-coordinate of the text
      .attr("y", 75) // Set the y-coordinate of the text
      .text(distinctMovieTitles) // Set the text content to the total movies count
      .attr("text-anchor", "middle") // Center align the text horizontally
      .style("font-size", "50px") // Set the font size
      .style("fill", "#f5f7f5"); // Set the text color
  }
  
  d3.csv("StreamingPlatform.csv").then(function(data) {
    calculateTotalMovies(data);
  });
  