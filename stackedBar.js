d3.csv("StreamingPlatform.csv").then(function(data) {
    // Filter the data for the first 5 genres
    var filteredData = data.filter(d => ["Top1", "Top2", "Top3", "Top4", "Top5"].includes(d.TopNGenre));

    // Group the data by genre and platform
    var groupedData = d3.group(filteredData, d => d.listed_in, d => d.Platform);

    // Calculate the count of each platform for each genre
    var stackedData = Array.from(groupedData, ([genre, platformData]) => ({
        genre: genre,
        platforms: Array.from(platformData, ([platform, movies]) => ({
            platform: platform,
            count: movies.length
        }))
    }));

    // Sort the platforms within each genre by count in descending order
    stackedData.forEach(genreData => {
        genreData.platforms.sort((a, b) => b.count - a.count);
        genreData.platforms = genreData.platforms.slice(0, 5); // Keep only the top 5 platforms
    });

    // Create the SVG container
    var svgSB = d3.select("#stackedBar")
        .append("svg")
        .attr("width",  20+width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up the scales
    var x = d3.scaleBand()
        .domain(stackedData.map(d => d.genre))
        .range([0, width+100])
        .padding(0.1);

    var y = d3.scaleLinear()
        .domain([0, d3.max(stackedData, d => d3.max(d.platforms, p => p.count))])
        .range([height, 0]);

    // Define platform colors
    var color = d3.scaleOrdinal()
      .domain(["Netflix", "Amazon Prime", "Disney+", "Hulu"])
      .range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728"]);

    // Create the stacked bars
    svgSB.selectAll(".stack")
        .data(stackedData)
        .enter()
        .append("g")
        .attr("class", "stack")
        .attr("transform", d => "translate(" + x(d.genre) + ",0)")
        .selectAll("rect")
        .data(d => d.platforms)
        .enter()
        .append("rect")
        .attr("x", d => x.bandwidth() / 4)
        .attr("y", d => y(d.count))
        .attr("width", x.bandwidth() / 2)
        .attr("height", d => height - y(d.count))
        .style("fill", d => color(d.platform));

    // Add the x-axis
    svgSB.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x))
        .selectAll("text")
        .style("fill", "white")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "0.15em");

    // Add the y-axis
    svgSB.append("g")
        .attr("class", "axis")
        .call(d3.axisLeft(y));
});
