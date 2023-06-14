function calculateTotalMovies(data) {
    var movieTitles = new Set();
  
    data.forEach(function(d) {
      if (d.type === "Movie") {
        movieTitles.add(d.title);
      }
    });
  
    var distinctMovieTitles = movieTitles.size;
  
    // Display the total number of movies in the HTML container
    var totalMoviesContainer = document.getElementById("totalMoviesContainer");
    totalMoviesContainer.innerText = distinctMovieTitles;
  }
  
  d3.csv("StreamingPlatform.csv").then(function(data) {
    calculateTotalMovies(data);
  });
  