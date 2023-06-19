const height = 300;
const width = 300;
const margin = {
  top: 20,
  right: 65,
  bottom: 60,
  left: 65,
};

d3.csv('StreamingPlatform.csv').then(function(data) {
    var groupedData = {};
    data.forEach(function(d) {
        var platform = d.Platform;
        var type = d.type;

        if (!groupedData[platform]) {
            groupedData[platform] = { Movie: 0, "TV Show": 0 };
        }

        groupedData[platform][type]++;
    });

    // Convert the grouped data into an array of objects
    var nestedData = Object.entries(groupedData).map(function([platform, counts]) {
        return { key: platform, values: Object.entries(counts) };
    });

    // Define color scale
    var color = d3.scaleOrdinal(d3.schemeSet2);

    // Create tooltip div
    var tooltipPie = d3.select("body")
        .append("div")
        .attr("class", "tooltipPie")
        .style("position", "absolute")
        .style("visibility", "hidden");

    // Iterate over each platform and create a pie chart
    nestedData.forEach(function(platform, i) {
        var pieId = "pie" + (i + 1);

        var svgPie = d3.select("#" + pieId)
            .append("svg")
            .attr("width", "100%")
            .attr("height", 200); // Increase the height to accommodate the platform label

        var radius = 75;
        var g = svgPie.append("g")
            .attr("transform", "translate(" + (radius + 20) + "," + (radius + 30) + ")"); // Adjust the y-coordinate to create space for the platform label

        // Create pie layout
        var pie = d3.pie()
            .value(function(d) { return d[1]; })
            .sort(null);

        // Generate arc for each slice
        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        // Generate pie chart slices
        // Generate pie chart slices
// Generate pie chart slices
var slices = g.selectAll("path")
    .data(pie(platform.values))
    .enter()
    .append("path")
    .attr("d", arc)
    .attr("fill", function(d, index) { return color(index); })
    .on("mouseover", function(event, d) {
        var x = d3.pointer(event)[0];
        var y = d3.pointer(event)[1];
        var tooltipText = "Count of <b>" + d.data[0] + "</b>"+ " in <b>" + platform.key+ "</b>" + ": <h2>" + d.data[1];
        tooltipPie.style("visibility", "visible")
            .style("top", y + "px")
            .style("left", x + "px")
            .html(tooltipText);
    })
    .on("mousemove", function(event) {
        tooltipPie
            .style("top", (d3.pointer(event)[1] + 300) + "px")
            .style("left", (d3.pointer(event)[0] + 40) + "px");
        console.log("Pieee");
    })
    .on("mouseout", function() {
        tooltipPie.style("visibility", "hidden");
    });



        // Add platform label
        svgPie.append("text")
            .attr("x", radius+25)
            .attr("y", 15) // Adjust the y-coordinate to move the text above the pie charts
            .attr("text-anchor", "middle")
            .text(platform.key)
            .style("font-size", "15px")
            .style("fill", "white") // Set the font color to white
            .style("font-weight", "bold");

        // Calculate total count for percentage calculation
        var totalCount = d3.sum(platform.values, function(d) { return d[1]; });

        // Add percentage distribution
        g.selectAll("label")
            .data(pie(platform.values))
            .enter()
            .append("text")
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
            .attr("dy", "1.5em")
            .text(function(d) {
                var percentage = ((d.data[1] / totalCount) * 100).toFixed(2);
                return percentage + "%";
            })
            .style("text-anchor", "middle")
            .style("font-size", "10px")
            .style("font-weight", "bold");
    });

});
