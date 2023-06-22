// Define the legend data
var legendData = [
  { platform: "Netflix", color: "#d62728" },    
  { platform: "Amazon Prime", color: "#ff7f0e" }, 
   { platform: "Disney+", color: "#1f77b4" },
  { platform: "Hulu", color: "#2ca02c" }
];

// Create the legend container
var legendContainer = d3.select("#legendPContainer");

// Create the legend items
var legendItems = legendContainer
  .selectAll(".legend-item")
  .data(legendData)
  .enter()
  .append("div")
  .attr("class", (d) => "legend-item " + d.platform.replace(/\s/g, '').replace("+", "\\+"));



// Add color squares to the legend items
legendItems
  .append("div")
  .attr("class", "legend-color")
  .style("background-color", (d) => d.color);

// Add platform labels to the legend items
legendItems
  .append("div")
  .attr("class", "legend-label")
  .style("color", (d) => d.color)
  .text((d) => d.platform);

// Add event listeners to the legend items

legendItems.on("click", function (event, d) {
  var platform = d.platform;
  var selectedLegend = d3.select(this);

  // Toggle the highlight class on the clicked legend item
  var isActive = selectedLegend.classed("highlight");
  selectedLegend.classed("highlight", !isActive);

  // Toggle the highlight class on the corresponding graph elements
  d3.selectAll(".bar." + platform.replace("+", "\\+")).classed("highlight", !isActive);

  console.log(platform);
  highlightPlatform(platform);
});


// Click event handler for legend items
function legendClickHandler(clickedData) {
  // Get the platform of the clicked legend item
  var clickedPlatform = clickedData.platform;

  // Highlight the clicked platform in the other graphs
  highlightPlatform(clickedPlatform);
}
// Function to highlight the selected platform in other graphs
function highlightPlatform(platform) {
  // Check if the clicked legend item has the highlight class
  var isActive = d3.select(".legend-item." + platform.replace(/\s/g, '').replace("+", "\\+")).classed("highlight");

  // Set the opacity of the pie chart elements based on whether the clicked legend item is active
  d3.select("#pie1").selectAll("path").style("opacity", (d) =>
    d.data.platform === platform ? (isActive ? 1 : (isActive ? 0.1 : 1)) : (isActive ? 0.1 : 1)
  );
  d3.select("#pie2").selectAll("path").style("opacity", (d) =>
    d.data.platform === platform ? (isActive ? 1 : (isActive ? 0.1 : 1)) : (isActive ? 0.1 : 1)
  );
  d3.select("#pie3").selectAll("path").style("opacity", (d) =>
    d.data.platform === platform ? (isActive ? 1 : 0.1) : (isActive ? 0.1 : 1)
  );
  d3.select("#pie4").selectAll("path").style("opacity", (d) =>
    d.data.platform === platform ? (isActive ? 1 : 0.1) : (isActive ? 0.1 : 1)
  );

  // Set the opacity and stroke width of the stacked bar chart elements based on whether the clicked legend item is active
  d3.select("#stackedBar")
    .selectAll("rect")
    .style("opacity", (d) => (d.platform === platform ? (isActive ? 1 : (isActive ? 0.1 : 1)) : (isActive ? 0.1 : 1)))
    .style("stroke-width", (d) => (d.platform === platform ? (isActive ? 2 : (isActive ? 0.1 : 2)) : (isActive ? 0.1 : 2)));

  // Set the opacity of the line chart elements based on whether the clicked legend item is active
  d3.select("#lineMT")
    .selectAll(".line")
    .style("opacity", (d) => (d.platform === platform ? (isActive ? 1 : (isActive ? 0.1 : 1)) : (isActive ? 0.1 : 1)));
}
