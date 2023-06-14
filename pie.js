const height = 300;
const width = 300;
const margin = {
  top: 20,
  right: 65,
  bottom: 60,
  left: 65,
};

d3.csv('StreamingPlatform.csv').then(function(data) {
    const distinctMovieTitles = new Set();
  const distinctTVShowTitles = new Set();
  
  data.forEach(function(d) {
    if (d.type === 'Movie') {
      distinctMovieTitles.add(d.title);
    } else if (d.type === 'TV Show') {
      distinctTVShowTitles.add(d.title);
    }
  });
  
  const totalDistinctMovies = distinctMovieTitles.size;
  const totalDistinctTVShows = distinctTVShowTitles.size;
  
  console.log('Total Distinct Movies:', totalDistinctMovies);
  console.log('Total Distinct TV Shows:', totalDistinctTVShows);
    // Group the data by platform and type and count the occurrences
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

    // Iterate over each platform and create a pie chart
    nestedData.forEach(function(platform, i) {
        var pieId = "pie" + (i + 1);

        var svg = d3.select("#" + pieId)
            .append("svg")
            .attr("width", "100%")
            .attr("height", 200); // Increase the height to accommodate the platform label

        var radius = 75;
        var g = svg.append("g")
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
        var slices = g.selectAll("path")
            .data(pie(platform.values))
            .enter()
            .append("path")
            .attr("d", arc)
            .attr("fill", function(d, index) { return color(index); });

        // Add platform label
        svg.append("text")
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

    // Create legend
    // var legend = d3.select("body")
    //     .append("div")
    //     .attr("class", "legend");

    // // Add legend for movies
    // var movieLegend = legend.append("div")
    //     .style("display", "flex")
    //     .style("align-items", "center")
    //     .style("margin-bottom", "5px");

    // movieLegend.append("span")
    //     .style("width", "10px")
    //     .style("height", "10px")
    //     .style("display", "inline-block")
    //     .style("background-color", color(0))
    //     .style("margin-right", "5px");

    // movieLegend.append("span")
    //     .text("Movies");

    // // Add legend for TV shows
    // var tvShowLegend = legend.append("div")
    //     .style("display", "flex")
    //     .style("align-items", "center")
    //     .style("margin-bottom", "10px");

    // tvShowLegend.append("span")
    //     .style("width", "10px")
    //     .style("height", "10px")
    //     .style("display", "inline-block")
    //     .style("background-color", color(1))
    //     .style("margin-right", "5px");

    // tvShowLegend.append("span")
    //     .text("TV Shows");

    // // Position the legend
    // var legendWidth = 100;
    // var legendHeight = nestedData.length * 20;
    // legend.style("position", "absolute")
    //     .style("top", "10px")
    //     .style("left", (300 + 20) + "px")
    //     .style("width", legendWidth + "px")
    //     .style("height", legendHeight + "px");

});
