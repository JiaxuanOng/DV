const height = 400;
const width = 500;
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

    // Define custom color scales for each platform
    var colorScales = {
        "Netflix": d3.scaleOrdinal().range(["#F71013", "#F7A4A5"]),
        "Amazon Prime": d3.scaleOrdinal().range(["#F7651B", "#F6C3A9"]),
        "Hulu": d3.scaleOrdinal().range(["#43D411", "#C0F7AD"]),
        "Disney+": d3.scaleOrdinal().range(["#074CF8", "#AAC0F6"])
        // Add more platforms and corresponding color scales if needed
    };
    
    // Create tooltip div
    var tooltipPie = d3
        .select("body")
        .append("div")
        .attr("class", "tooltipPie")
        .style("position", "absolute")
        .style("visibility", "hidden");
    
    // Iterate over each platform and create a pie chart
    nestedData.forEach(function (platform, i) {
        var pieId = "pie" + (i + 1);
    
        var svgPie = d3
        .select("#" + pieId)
        .append("svg")
        .attr("width", 250)
        .attr("height", 500); // Increase the height to accommodate the platform label
    
        var radius = 90;
    
        var g = svgPie
        .append("g")
        .attr(
            "transform",
            "translate(" + (radius + 30) + "," + (radius + 60) + ")"
        ); // Adjust the y-coordinate to create space for the platform label
    
        // Create pie layout
        var pie = d3
        .pie()
        .value(function (d) {
            return d[1];
        })
        .sort(null);
    
        // Generate arc for each slice
        var arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius);
    
        // Generate pie chart slices
        var slices = g
        .selectAll("path")
        .data(pie(platform.values))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("fill", function (d, index) {
            // Use the custom color scale based on platform
            return colorScales[platform.key](index);
        })
        .on("mouseover", function(event, d) {
            var tooltipText = "Count of <b>" + d.data[0] + "</b>" + " in <b>" + platform.key + "</b>" + ": <h2 style='text-align: center;'>" + d.data[1];

            // Calculate the centroid of the arc
            var centroid = arc.centroid(d);
            var x = centroid[0] + width / 2;
            var y = centroid[1] + height / 2;

            // Check if the selected chart is on the right side
            if (x > width / 2) {
            x = x - tooltipPie.node().getBoundingClientRect().width; // Adjust the x position for right-hand side charts
            }

            tooltipPie.style("visibility", "visible")
            .style("top", y + "px")
            .style("left", x + "px")
            .html(tooltipText);
        })
        .on("mousemove", function(event) {
            var x = d3.pointer(event)[0];
            var y = d3.pointer(event)[1];
        
            // Check if the selected chart is on the right side
            if (x > width / 2) {
                x = x - tooltipPie.node().getBoundingClientRect().width; // Adjust the x position for right-hand side charts
            }
        
            // Check if the platform is "Disney+" and the type is "TV Show"
            if (platform.key === "Disney+") {
                tooltipPie
                    .style("top", (y + 500) + "px") // Adjust the y position specifically for "Disney+" TV show
                    .style("left", (x + 100) + "px");
            } else {
                tooltipPie
                    .style("top", (y + 500) + "px")
                    .style("left", (x + 200) + "px");
            }
        })
        
        .on("mouseout", function() {
            tooltipPie.style("visibility", "hidden");
        });


        // Add platform label
        svgPie.append("text")
            .attr("x", radius+30)
            .attr("y", 55) // Adjust the y-coordinate to move the text above the pie charts
            .attr("text-anchor", "middle")
            .text(platform.key)
            .style("font-size", "20px")
            .style("fill", "white"); // Set the font color to white

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
            .style("font-size", "15px")
            .style("font-weight", "bold");
    });

});
