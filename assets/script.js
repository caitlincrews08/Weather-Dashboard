// personal api key for Open Weather API
var APIkey = "07878bc44dc3a773e98c14539268a8e4";
var cities = [];
cities.reverse();

//get from local storage
function loadFromStore() {
  cities = JSON.parse(localStorage.getItem("cities")) || [];
  getCityWeatherInfo(cities[cities.length-1]);
};

loadFromStore();

//save to local storage
function saveToStore() {
  localStorage.setItem("cities", JSON.stringify(cities));
}

//Display from local storage
  // city input by user
function citiesDisplay() {
  var limit = cities.length;

  $(".savedSearches").html("");
  for (var c = 0; c < limit; c++) {
    var cityViewed = $("<div>");

    // figured out this attribute with the help of my tutor
    cityViewed.attr("id", `${cities[c]}`);
    cityViewed.addClass("row");
    var theCity = cityViewed.html(cities[c]);
    // console.log(theCity);
    $(".savedSearches").prepend(theCity);
    
    $(`#${cities[c]}`).on("click", function (event) {
      event.preventDefault();
      var currentCity = $(this).text();
      // console.log($(this).text());
      getCityWeatherInfo(currentCity)
    });
  };
};
citiesDisplay();


//uv function
function getUV(lat, lon) {
  var uvIndexURL = "https://api.openweathermap.org/data/2.5/uvi/forecast?appid=" + APIkey + "&lat=" + lat + "&lon=" + lon + "&cnt=1";

  $.ajax({ 
    url: uvIndexURL,
    method: "GET"
   }).then(function (response) {
    console.log(response[0].value)
    $(".uv").text("UV-index : " + response[0].value);
  });
}

// 5 day forecast function
function forecast(city) {
  var forecastURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey + "&units=imperial";

  // ajax call to forecast api
  $.ajax({
    url: forecastURL,
    method: "GET"
  }).then(function (response) {
    // catches 5 different days at 3:00 instead of every 3 hours
    var filteredList = response.list.filter(function(item){
      return item.dt_txt.indexOf("15:00:00") > -1;
    });
    console.log(filteredList);
    // for each iteration of our loop
    $(".forecast").html("");
    for ( i = 0; i < filteredList.length; i++) {
      var temp = filteredList[i].main.temp;
      var iconId = filteredList[i].weather[0].icon;
      var humidity = filteredList[i].main.humidity;
      var date = new Date(filteredList[i].dt_txt);

      var day = date.getDate();
      var month = date.getMonth();
      var year = date.getFullYear();

      var formatedDate = `${month + 1}/${day}/${year}`;
      // Creating and storing a div tag
      var col = $("<div>").attr("class", "eachDay col-md-2 ml-3");
      var mycard = $("<div>");
      mycard.addClass("card");
      col.append(mycard);

      // Creating a paragraph tag with the response item
      var p = $("<p>").text(formatedDate);
      // Creating and storing an image tag

      var iconUrl = "https://openweathermap.org/img/wn/" + iconId + "@2x.png";

      var weatherImage = $("<img>");
      // Setting the src attribute of the image to a property pulled off the result item
      weatherImage.attr("src", iconUrl);

      var p1 = $("<p>").text("Temp: " + temp + "°F");
      var p2 = $("<p>").text("Humidity: " + humidity + "%");

      // Appending the paragraph and image tag to mycard
      mycard.append(p);
      mycard.append(weatherImage);
      mycard.append(p1);
      mycard.append(p2);

      // Prependng the col to the HTML page in the "#forecast" div

      $(".forecast").append(col);
    }
  });
}

$("#search").on("click", function(event) {
  // prevents refresh
  event.preventDefault();
  // city input by user
  var cityName = $("#cityInput").val();

  if(!cities.includes(cityName)){
    cities.push(cityName);
    saveToStore();
  }
  citiesDisplay();
  getCityWeatherInfo (cityName);
});
// click event when the user presses search"
function getCityWeatherInfo (city) {

  // querys API with users city input and my api key
  var queryurl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + APIkey + "&units=imperial";

    // calls API
  $.ajax({
    url: queryurl,
    method: "GET"
    // displays JSON response to user
  }).then(function(response){
    var currentDate = moment().format("LL");
    console.log(response);
    // var iconLoc = response.weather[0].icon;
    var iconLoc = response.list[0].weather[0].icon
    console.log(response.city.name)

    var iconSrc = "https://openweathermap.org/img/wn/" + iconLoc + "@2x.png";
    var iconImage = $("<img>");
    iconImage.attr("src", iconSrc);
    console.log(response.list[0].main.temp)
    var tempF = response.list[0].main.temp;
    // // Converts the temp to Kelvin with the below formula
    $(".tempF").text("Temperature (Kelvin) " + tempF);

    $(".current-city").text(response.city.name + " (" + currentDate + ")");
    $(".current-city").append(iconImage);
    $(".temp").text("Temperature : " + tempF + " °F");
    $(".hum").text("Humidity : " + response.list[0].main.humidity + " %");
    $(".windy").text("Wind Speed : " + response.list[0].wind.speed + " MPH");


    getUV(response.city.coord.lat, response.city.coord.lon);
    forecast(city);
    // input.val("");

    // $("#displayWeather").text(JSON.stringify(response));
  });
}
