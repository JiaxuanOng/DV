function zoomed(event) {
    const {transform} = event;
    g.attr("transform", transform);
    g.attr("stroke-width", 1 / transform.k);
  }
function reset() {
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity,
      d3.zoomTransform(svg.node()).invert([widthM / 2, height / 2])
    );
}
const widthM = 550;
const height = 400;

const zoom = d3.zoom()
			   .scaleExtent([1, 8])
			   .on("zoom", zoomed);

const svg = d3.select("#map")
			  .attr("viewBox", [0, 0, widthM, height])
			  .append("svg")
			  .attr("width", widthM)
			  .attr("height", height)
			  .on("click", reset);
		
const g = svg.append("g");

const tooltip = d3.select(".tooltip");
//const color_domain = [2.5, 4, 7, 9, 10];

//const colorScale = d3.scaleSequential(d3.interpolateReds);

const colorScale = d3.scaleLinear()
					 //.clamp(true)
					 //.range(['#5F9EA0', "red"])
					 .range(['#eff3ff', '#08519c']);
	  // Define the color range and domain
//const colorScale = d3.scaleSequential()
//  .domain(color_domain)
//  .range(['#fee5d9', '#fcbba1', '#fc9272',  '#fb6a4a', '#de2d26', '#a50f15']);
g.selectAll("path")
  .style("filter", "drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2))"); // Add a drop shadow to map paths
svg.transition().duration(750).style("opacity", 1);

// Load the countries geoJSON data
d3.json("https://datahub.io/core/geo-countries/r/countries.geojson").then(function (mapData) {
	const countries = mapData.features;

	const countryNameMap = {};
	countries.forEach((country) => {
		const countryName = country.properties.ADMIN;
		countryNameMap[countryName] = country;
	});

	const projection = d3.geoMercator().rotate([-11, 0])
						 .scale(225)
						 .center([114.1095, 22.3964])
						.translate([0, 0])
						.fitSize([widthM, height], mapData);
	const path = d3.geoPath().projection(projection);

	d3.csv("StreamingPlatform.csv").then(function(data) {
	let filteredData = data;
	let maxSum = 0; // Maximum sum of shows/movies

	updateMap();

	d3.selectAll('input[name="platform"], input[name="type"]').on("change", function() {
		updateMap();
	});
	function fixCountryName(countryName) {
		// Special cases for country name differences
		if (countryName === "United States of America") {
		  return "United States";
		}
		return countryName;
	}
	
	function filterLabelsByRank(labels, rank) {
		return labels.filter((label) => label.properties.scalerank <= rank);
	}

	function updateMap() {
	// Filter data based on platform and type
		const platformFilter = d3.select('input[name="platform"]:checked').node().value;
		const typeFilter = d3.select('input[name="type"]:checked').node().value;
		filteredData = data.filter((d) => d.Platform === platformFilter && d.type === typeFilter);

		// Aggregate the sum of shows/movies by country
		const sumByCountry = filteredData.reduce((acc, d) => {
		  const countryName = fixCountryName(d.country);
			  if (countryName) {
				if (!acc[countryName]) {
				  acc[countryName] = 0;
				}
				acc[countryName]++;
			  }
			  return acc;
			}, {});

	// Find the maximum sum for scaling the color gradient
	maxSum = d3.max(Object.values(sumByCountry));

	// Update the color scale domain based on the maximum sum
	colorScale.domain([0, maxSum]);

	g.selectAll("path")
	 .data(countries)
	 .join("path")
	 .attr("d", path)
	 .attr('preserveAspectRatio', 'xMidYMid')
	 .style('max-width', 1200)
	 .style('margin', 'auto')
	 .style('display', 'flex')
	 .attr("fill", (d) => {
		const countryName = fixCountryName(d.properties.ADMIN);
		//const fixedCountryName = fixCountryName(countryName); // Fix the country name again
		const countrySum = sumByCountry[countryName];
		if (countrySum) {
			
		  return colorScale(countrySum);
		}
		return "black";
	 })
	 .attr("stroke", "#FFF")
  .attr("stroke-width", 0.5)
	 .on("mouseover", function (event, d) {
		d3.select(this).attr("stroke", "white")
		.transition()
      .duration(2000)
      .attr("transform", "scale(1.1)");
		// Get mouse position
		const [x, y] = d3.pointer(event);
		// Display tooltip with country name and show count
		tooltip
		  .style("left", (x + 500)+ "px")
		  .style("center", y + "px")
		  .style("display", "block")
		  .text("Country(" + d.properties.ADMIN + "): " + getShowCount(fixCountryName(d.properties.ADMIN)));
	  })
	 .on("mouseout", function () {
		d3.select(this).attr("stroke", null)
		.transition()
      .duration(2000)
      .attr("transform", "scale(1)");
		// Hide tooltip
		tooltip.style("display", "none");
	  })
	  .on("click", handleCountryClick);
		function handleCountryClick(event, d) {
	  // Get the clicked country's data
	  var clickedCountry = fixCountryName(d.properties.ADMIN);

	  // Update other charts based on the clicked country
	  updateCharts(clickedCountry);
}

	  function updateCharts(clickedCountry) {
  // Filter and process data based on the clicked country
  var Data = filteredData.filter(function(d) {
    return d.country === clickedCountry;
  });

  // Update the other charts using the filtered data
  // ...
	updateChart1(Data);
    updateChart2(Data);
	updateChart3(Data);
	updateData4(Data);
  //Chart1.update(filteredData);
  // Redraw or update the charts
  // ...
}

	  
	  const countriesWithValue = countries.filter(country => {
		const countryName = fixCountryName(country.properties.ADMIN);
		return sumByCountry[countryName] > 0;
	  });
 
	
	  svg.call(zoom);
	  

	// Update the color legend
	const legendScale = d3.scaleLinear().domain([0, maxSum]).range([200, 0]);
	const legendColors = Array.from({ length: 10 }, (_, i) => colorScale(i * (maxSum / 10)));
	const legendLabels = Array.from({ length: 10 }, (_, i) => Math.round(i * (maxSum / 10)));

	d3.select(".legend-scale-color")
	  .attr("fill", "url(#gradient)")
	  .attr("x", 0)
	  .attr("y", 0)
	  .attr("width", 20)
	  .attr("height", 200);

	const legendGradient = svg
	  .append("defs")
	  .append("linearGradient")
	  .attr("id", "gradient")
	  .attr("x1", "0%")
	  .attr("x2", "0%")
	  .attr("y1", "0%")
	  .attr("y2", "100%");

	legendGradient
	  .selectAll("stop")
	  .data(legendColors)
	  .enter()
	  .append("stop")
	  .attr("offset", (_, i) => i * 100 / 9 + "%")
	  .attr("stop-color", d => d);

	d3.select(".legend-scale-labels")
	  .selectAll("span")
	  .data(legendLabels)
	  .join("span")
	  .text(d => d);
	}

	function getShowCount(country) {
	const count = filteredData.filter(d => d.country === country);
	const distinctTitles = new Set(count.map(d => d.title));
	return distinctTitles.size;
	}
	});
});