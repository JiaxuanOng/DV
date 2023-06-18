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
      .attr("width", 370) // Set the width of the SVG container
      .attr("height", 100); // Set the height of the SVG container
  
    var tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");
  
    if (bestPlatform === "netflix") {
      svgBP
        .append("image")
        .attr("xlink:href", "netflix_logo.png")
        .attr("width", 300)
        .attr("height", 90)
        .attr("x", 30) // Set the x-coordinate for centering the logo
        .attr("y", 10);
    } else if (bestPlatform === "amazon") {
      svgBP
        .append("image")
        .attr("xlink:href", "amazon_logo.png")
        .attr("width", 300)
        .attr("height", 90)
        .attr("x", 30) // Set the x-coordinate for centering the logo
        .attr("y", 10)
        .on("mouseover", function () {
          tooltip.style("visibility", "visible").html("Total Shows in " + bestPlatform + ": "  + distinctTitles.length);
        })
        .on("mousemove", function (event) {
          tooltip
            .style("top", d3.pointer(event)[1] + window.pageYOffset + 10 + "px")
            .style("left", d3.pointer(event)[0] + window.pageXOffset + 900 + "px");
        })
        .on("mouseout", function () {
          tooltip.style("visibility", "hidden");
        });
    } else if (bestPlatform === "disney") {
      svgBP
        .append("image")
        .attr("xlink:href", "disney_logo.png")
        .attr("width", 300)
        .attr("height", 100)
        .attr("x", 30) // Set the x-coordinate for centering the logo
        .attr("y", 10);
    } else if (bestPlatform === "hulu") {
      svgBP
        .append("image")
        .attr("xlink:href", "hulu_logo.png")
        .attr("width", 300)
        .attr("height", 100)
        .attr("x", 30) // Set the x-coordinate for centering the logo
        .attr("y", 10);
    }
  }
  
  d3.csv("StreamingPlatform.csv").then(function (data) {
    calculateBestPlatform(data);
  });
  