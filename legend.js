// Define the legend data
var legendData = [
    { platform: "Netflix", color: "#1f77b4" },
    { platform: "Amazon Prime", color: "#ff7f0e" },
    { platform: "Disney+", color: "#2ca02c" },
    { platform: "Hulu", color: "#d62728" }
  ];
  
  // Create the legend container
  var legendContainer = d3.select("#legendPContainer");
  
  // Create the legend items
  var legendItems = legendContainer.selectAll(".legend-item")
    .data(legendData)
    .enter()
    .append("div")
    .attr("class", "legend-item");
  
  // Add color squares to the legend items
  legendItems.append("div")
    .attr("class", "legend-color")
    .style("background-color", d => d.color);
  
  // Add platform labels to the legend items
  legendItems.append("div")
  .attr("class", "legend-label")
  .style("color", d => d.color)
  .text(d => d.platform);

