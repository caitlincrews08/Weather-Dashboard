// personal api key for Open Weather API
var APIkey = "07878bc44dc3a773e98c14539268a8e4";

// click event when the user presses search"
$("#search").on("click", function(event) {
  // prevents refresh
  event.preventDefault();

  // city input by user
  var cityName = $("#cityInput").val();

  // querys API with users city input and my api key
  var queryurl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + APIkey;

    // calls API
  $.ajax({
    url: queryurl,
    method: "GET"
    // displays JSON response to user
  }).then(function(response){
    $("#displayWeather").text(JSON.stringify(response));
  });
});