function calculateBestPlatform(data) {
    var platformCounts = d3.rollup(
      data,
      v => new Set(v.map(d => d.title)).size,
      d => d.Platform
    );
  
    var platformTitles = d3.rollup(
      data,
      v => Array.from(new Set(v.map(d => d.title))),
      d => d.Platform
    );
  
    var maxCount = 0;
    var bestPlatform;
  
    platformCounts.forEach((count, platform) => {
      if (count > maxCount) {
        maxCount = count;
        bestPlatform = platform;
      }
    });
  
    var distinctTitles = platformTitles.get(bestPlatform);

    // Create an SVG container for displaying the best platform
    var svgBP = d3
      .select("#bestPlatformContainer")
      .append("svg")
      .attr("width", 170) // Set the width of the SVG container
      .attr("height", 100); // Set the height of the SVG container
  

    if (bestPlatform === "netflix") {
    svgBP
        .append("image")
        .attr("xlink:href", "netflix_logo.png")
        .attr("width", 100)
        .attr("height", 100);
    } else if (bestPlatform === "amazon"){
        svgBP
        .append("image")
        .attr("xlink:href", "amazon_logo.png")
        .attr("width", 100)
        .attr("height", 100);
    }

    else if (bestPlatform === "disney"){
        svgBP
        .append("image")
        .attr("xlink:href", "disney_logo.png")
        .attr("width", 100)
        .attr("height", 100);
    }

    else if (bestPlatform === "hulu"){
        svgBP
        .append("image")
        .attr("xlink:href", "hulu_logo.png")
        .attr("width", 100)
        .attr("height", 100);
    }
    // Add text to the SVG container
    // svgBP
    //   .append("text")
    //   .attr("x", 80) // Set the x-coordinate of the text
    //   .attr("y", 75) // Set the y-coordinate of the text
    //   .text(bestPlatform) // Set the text content to the best platform
    //   .attr("text-anchor", "middle") // Center align the text horizontally
    //   .style("font-size", "40px") // Set the font size
    //   .style("fill", "red"); // Set the text color
  }
  
  d3.csv("StreamingPlatform.csv").then(function(data) {
    calculateBestPlatform(data);
  });
  