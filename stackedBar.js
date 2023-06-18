// const height = 300;
// const width = 400;
// const margin = {
//   top: 20,
//   right: 75,
//   bottom: 60,
//   left: 75,
// };

d3.csv("StreamingPlatform.csv").then(function(data) {
    // Filter the data for the first 5 genres
    var filteredData = data.filter(d => ["Top1", "Top2", "Top3", "Top4", "Top5"].includes(d.TopNGenre));
    console.log("11");
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

    // // Set up the chart dimensions
    // var margin = {top: 20, right: 20, bottom: 30, left: 40};
    // var width = 800 - margin.left - margin.right;
    // var height = 400 - margin.top - margin.bottom;

    // Create the SVG container
    var svg = d3.select("#stackedBar")
                .append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Set up the scales
    var x = d3.scaleBand()
              .domain(stackedData.map(d => d.genre))
              .range([0, width])
              .padding(0.1);

    var y = d3.scaleLinear()
              .domain([0, d3.max(stackedData, d => d3.max(d.platforms, p => p.count))])
              .range([height, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // Create the stacked bars
    svg.selectAll(".stack")
       .data(stackedData)
       .enter().append("g")
       .attr("class", "stack")
       .attr("transform", d => "translate(" + x(d.genre) + ",0)")
       .selectAll("rect")
       .data(d => d.platforms)
       .enter().append("rect")
       .attr("x", d => x.bandwidth() / 4)
       .attr("y", d => y(d.count))
       .attr("width", x.bandwidth() / 2)
       .attr("height", d => height - y(d.count))
       .style("fill", d => color(d.platform));

    // Add the x-axis
    svg.append("g")
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
    svg.append("g")
       .attr("class", "axis")
       .call(d3.axisLeft(y));

    // // Add the legend
    // var legend = svg.selectAll(".legend")
    //                 .data(stackedData[0].platforms.map(d => d.platform))
    //                 .enter().append("g")
    //                 .attr("class", "legend")
    //                 .attr("transform", (d, i) => "translate(0," + i * 20 + ")");

    // legend.append("rect")
    //       .attr("x", width - 18)
    //       .attr("width", 18)
    //       .attr("height", 18)
    //       .style("fill", d => color(d));

    // legend.append("text")
    //       .attr("x", width - 24)
    //       .attr("y", 9)
    //       .attr("dy", ".35em")
    //       .style("text-anchor", "end")
    //       .text(d => d);
});

