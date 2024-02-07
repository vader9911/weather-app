document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "fef58a10c0df34dec267d61fe76ef6af";

  let recentSearches = [];

  // Function to update the recent searches list
  function updateRecentSearches() {
    let searchList = $("#recent-searches");
    searchList.empty();
    recentSearches = recentSearches.slice(-10);
    for (let i = 0; i < recentSearches.length; i++) {
      $(
        "<li class='list-group-item py-3 '>" + recentSearches[i] + "</li>"
      ).appendTo(searchList);
    }
  }
  //https://api.openweathermap.org/data/2.5/weather?q=austin&units=imperial&appid=fef58a10c0df34dec267d61fe76ef6af

  //weather api call
  function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;
    console.log("called api");
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          alert("City not found, please check spelling and try again");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        console.log(response);
        return response.json();
      })
      .then((data) => {
        // Check if the response includes a valid city name
        if (data && data.name) {
          console.log(data);

          let cityName = data.name;
          let cityTemp = data.main.temp;
          let cityWind = data;
          let cityHumid = data;
          $("#city-name-header").text(cityName);
          $("#current-temp").text( cityTemp + "F")
          generateLists();
          // If it's a valid city, push it to recent searches
          recentSearches.push(city);
          updateRecentSearches();
        } else {
          alert("Invalid city data. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function generateLists() {
    // Get the container where lists will be appended
    const container = $("#lists-container");
    // Reset lists
    container.empty();
    // Generate 5 lists
    for (let i = 1; i <= 5; i++) {
      // Create a new list
      const newList = $("<ul>").addClass("list-group m-2 day-" + i);
    
      // Create list items with unique IDs
      for (let j = 1; j <= 4; j++) {
        const listItem = $("<li>")
          .addClass("list-group-item p-3")
          .attr("id", `${j}-${i}`);
        newList.append(listItem);
      }

      // Append the new list to the container
      container.append(newList);
    }
  }

  //search bar function to collect search

  let search = $("#search-box");
  let submit = $("#search-submit");

  submit.on("click", function () {
    event.preventDefault();
    let searchInput = search.val();
    const city = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);

    //add search to recent searches & local storage
    if (searchInput !== "") {
      getWeatherData(city);

      let searchCount = localStorage.getItem("searchCount") || 0;
      searchCount++;
      localStorage.setItem("searchCount", searchCount);
      const searchKey = `search${searchCount}`;
      localStorage.setItem(searchKey, city);
      localStorage.removeItem();
    } else {
      alert("Search cannot be blank");
    }
  });

  //Function to pop city data to the info card
  // function checkWeather () {
  //     let cityName = data.name;
  //     let cityWeather = data.main.temp;

  //     console.log(cityName, cityWeather);

  // }
});
