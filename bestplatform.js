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
  
    if (bestPlatform === "Netflix") {
        svgBP
        .append("image")
        .attr("xlink:href", "netflix_logo.png")
        .attr("width", 300)
        .attr("height", 90)
        .attr("x", 30) // Set the x-coordinate for centering the logo
        .attr("y", 10)
        .on("mouseover", function () {
            tooltip.style("visibility", "visible");
    
            // Remove any existing content inside the tooltip
            tooltip.html("");
    
            // Create a bar chart inside the tooltip
            var platformData = Array.from(platformCounts, ([platform, count]) => ({
              platform,
              count,
            }));
    
           // Create a bar chart inside the tooltip
        var tooltipSvg = tooltip
        .append("svg")
        .attr("width", 450)
        .attr("height", 200);

        var margin = { top: 10, right: 10, bottom: 30, left: 80 };
        var width = 400 - margin.left - margin.right;
        var height = 200 - margin.top - margin.bottom;

        var x = d3
        .scaleLinear()
        .domain([0, d3.max(platformData, (d) => d.count)])
        .range([0, width]);

        var y = d3
        .scaleBand()
        .domain(platformData.map((d) => d.platform))
        .range([height, 0])
        .padding(0.1);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);

        var chart = tooltipSvg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        chart.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        chart.selectAll(".bar")
        .data(platformData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", (d) => y(d.platform))
        .attr("width", (d) => x(d.count))
        .attr("height", y.bandwidth())
        .attr("fill", (d, i) => colorScale(i));
 
        chart.selectAll(".bar-label")
        .data(platformData)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", (d) => x(d.count) + 5)
        .attr("y", (d) => y(d.platform) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text((d) => d.count)
        .style("font-size", "10px")
        .attr("fill", "black");

        tooltipSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", 30+ width / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .text("Total Shows per Platform")
        .style("font-size", "15px")
        .attr("fill", "black");

          })
          .on("mousemove", function () {
            tooltip
              .style("top", d3.pointer(event)[1] + 100 + "px")
              .style("left", d3.pointer(event)[0] + 10 + "px");
          })
          .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
          });
    } else if (bestPlatform === "Amazon Prime") {
        
      svgBP
        .append("image")
        .attr("xlink:href", "amazon_logo.png")
        .attr("width", 300)
        .attr("height", 90)
        .attr("x", 30) // Set the x-coordinate for centering the logo
        .attr("y", 10)
        .on("mouseover", function () {
            console.log(bestPlatform);
            tooltip.style("visibility", "visible");
    
            // Remove any existing content inside the tooltip
            tooltip.html("");
    
            // Create a bar chart inside the tooltip
            var platformData = Array.from(platformCounts, ([platform, count]) => ({
              platform,
              count,
            }));
    
           // Create a bar chart inside the tooltip
        var tooltipSvg = tooltip
        .append("svg")
        .attr("width", 450)
        .attr("height", 200);

        var margin = { top: 10, right: 10, bottom: 30, left: 80 };
        var width = 400 - margin.left - margin.right;
        var height = 200 - margin.top - margin.bottom;

        var x = d3
        .scaleLinear()
        .domain([0, d3.max(platformData, (d) => d.count)])
        .range([0, width]);

        var y = d3
        .scaleBand()
        .domain(platformData.map((d) => d.platform))
        .range([height, 0])
        .padding(0.1);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);

        var chart = tooltipSvg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        chart.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        chart.selectAll(".bar")
        .data(platformData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", (d) => y(d.platform))
        .attr("width", (d) => x(d.count))
        .attr("height", y.bandwidth())
        .attr("fill", (d, i) => colorScale(i));
 
        chart.selectAll(".bar-label")
        .data(platformData)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", (d) => x(d.count) + 5)
        .attr("y", (d) => y(d.platform) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text((d) => d.count)
        .style("font-size", "10px")
        .attr("fill", "black");

        tooltipSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .text("Total Shows per Platform")
        .style("font-size", "15px")
        .attr("fill", "black");

          })
          .on("mousemove", function () {
            tooltip
              .style("top", d3.pointer(event)[1] + 100 + "px")
              .style("left", d3.pointer(event)[0] + 10 + "px");
          })
          .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
          });
    } else if (bestPlatform === "Disney+") {
        svgBP
        .append("image")
        .attr("xlink:href", "disney_logo.png")
        .attr("width", 300)
        .attr("height", 90)
        .attr("x", 30) // Set the x-coordinate for centering the logo
        .attr("y", 10)
        .on("mouseover", function () {
            tooltip.style("visibility", "visible");
    
            // Remove any existing content inside the tooltip
            tooltip.html("");
    
            // Create a bar chart inside the tooltip
            var platformData = Array.from(platformCounts, ([platform, count]) => ({
              platform,
              count,
            }));
    
           // Create a bar chart inside the tooltip
        var tooltipSvg = tooltip
        .append("svg")
        .attr("width", 450)
        .attr("height", 200);

        var margin = { top: 10, right: 10, bottom: 30, left: 80 };
        var width = 400 - margin.left - margin.right;
        var height = 200 - margin.top - margin.bottom;

        var x = d3
        .scaleLinear()
        .domain([0, d3.max(platformData, (d) => d.count)])
        .range([0, width]);

        var y = d3
        .scaleBand()
        .domain(platformData.map((d) => d.platform))
        .range([height, 0])
        .padding(0.1);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);

        var chart = tooltipSvg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        chart.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        chart.selectAll(".bar")
        .data(platformData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", (d) => y(d.platform))
        .attr("width", (d) => x(d.count))
        .attr("height", y.bandwidth())
        .attr("fill", (d, i) => colorScale(i));
 
        chart.selectAll(".bar-label")
        .data(platformData)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", (d) => x(d.count) + 5)
        .attr("y", (d) => y(d.platform) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text((d) => d.count)
        .style("font-size", "10px")
        .attr("fill", "black");

        tooltipSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", 30+ width / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .text("Total Shows per Platform")
        .style("font-size", "15px")
        .attr("fill", "black");

          })
          .on("mousemove", function () {
            tooltip
              .style("top", d3.pointer(event)[1] + 100 + "px")
              .style("left", d3.pointer(event)[0] + 10 + "px");
          })
          .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
          });
    } else if (bestPlatform === "Hulu") {
        svgBP
        .append("image")
        .attr("xlink:href", "hulu_logo.png")
        .attr("width", 300)
        .attr("height", 90)
        .attr("x", 30) // Set the x-coordinate for centering the logo
        .attr("y", 10)
        .on("mouseover", function () {
            tooltip.style("visibility", "visible");
    
            // Remove any existing content inside the tooltip
            tooltip.html("");
    
            // Create a bar chart inside the tooltip
            var platformData = Array.from(platformCounts, ([platform, count]) => ({
              platform,
              count,
            }));
    
           // Create a bar chart inside the tooltip
        var tooltipSvg = tooltip
        .append("svg")
        .attr("width", 450)
        .attr("height", 200);

        var margin = { top: 10, right: 10, bottom: 30, left: 80 };
        var width = 400 - margin.left - margin.right;
        var height = 200 - margin.top - margin.bottom;

        var x = d3
        .scaleLinear()
        .domain([0, d3.max(platformData, (d) => d.count)])
        .range([0, width]);

        var y = d3
        .scaleBand()
        .domain(platformData.map((d) => d.platform))
        .range([height, 0])
        .padding(0.1);

        var xAxis = d3.axisBottom(x);
        var yAxis = d3.axisLeft(y);

        var chart = tooltipSvg
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        chart.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

        chart.append("g")
        .attr("class", "y-axis")
        .call(yAxis);
        var colorScale = d3.scaleOrdinal(d3.schemeCategory10);
        chart.selectAll(".bar")
        .data(platformData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("y", (d) => y(d.platform))
        .attr("width", (d) => x(d.count))
        .attr("height", y.bandwidth())
        .attr("fill", (d, i) => colorScale(i));
 
        chart.selectAll(".bar-label")
        .data(platformData)
        .enter()
        .append("text")
        .attr("class", "bar-label")
        .attr("x", (d) => x(d.count) + 5)
        .attr("y", (d) => y(d.platform) + y.bandwidth() / 2)
        .attr("dy", "0.35em")
        .text((d) => d.count)
        .style("font-size", "10px")
        .attr("fill", "black");

        tooltipSvg.append("text")
        .attr("class", "chart-title")
        .attr("x", 30+ width / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .text("Total Shows per Platform")
        .style("font-size", "15px")
        .attr("fill", "black");

          })
          .on("mousemove", function () {
            tooltip
              .style("top", d3.pointer(event)[1] + 100 + "px")
              .style("left", d3.pointer(event)[0] + 10 + "px");
          })
          .on("mouseout", function () {
            tooltip.style("visibility", "hidden");
          });
    }
  }
  
  d3.csv("StreamingPlatform.csv").then(function (data) {
    calculateBestPlatform(data);
  });
  