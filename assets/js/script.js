document.addEventListener("DOMContentLoaded", function () {
  const apiKey = "fef58a10c0df34dec267d61fe76ef6af";
  localStorage.clear();

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


function getCityCoords(city) {
  const apiUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`;
  console.log("called api");
  
  // Return the promise from fetch
  return fetch(apiUrl)
      .then((response) => {
          if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
      })
      .then((data) => {
          // Check if the response includes a valid city name
          if (data && data.length > 0 && data[0].name) {
              const { lat, lon } = data[0];
              console.log(data[0])
              // Return an object containing lat and lon
              return { lat, lon };
          } else {
              throw new Error("City not found, please check spelling and try again");
          }
      })
      .catch((error) => {
          // Handle any errors that occurred during the fetch or data processing
          console.error("Error:", error);
          throw error; // Rethrow the error to be caught 
      });
}



  




  //weather api call
  function getWeatherData(lat, lon) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
    console.log("called api");
    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          alert("City not found, please check spelling and try again");
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Check if the response includes a valid city name
        if (data) {
          console.log(data);

          function generateLists() {
            // Get the container where lists will be appended
            const container = $("#lists-container");
            // Reset lists
            container.empty();
            // Generate 5 day forecast lists
            for (let i = 0; i < 5; i++) {
              // Calculate the index for each day (24-hour intervals)
              const index = i * 8; 
          
              // Create a new list for each day
              const newList = $("<ul>").addClass("list-group m-2 day-" + (i + 1));
          
              // Access data for the current day's index
              if (index < data.list.length) {
                  const listItem = $("<li>")
                      .addClass("list-group-item p-3")
                      .attr("id", `${i}-0`); // Setting ID for the day
          
                  // Fill out the list item with data for the corresponding day
                  const date = data.list[index].dt_txt;
                  const cityTemp = data.list[index].main.temp;
                  const cityWind = data.list[index].wind.speed;
                  const cityHumid = data.list[index].main.humidity;
          
                  // Append the data to the list item
                  listItem.append(`<p>Date: ${date}</p>`);
                  listItem.append(`<p>Temperature: ${cityTemp}F</p>`);
                  listItem.append(`<p>Wind: ${cityWind} mph</p>`);
                  listItem.append(`<p>Humidity: ${cityHumid}%</p>`);
          
                  // Append the list item to the list for the day
                  newList.append(listItem);
              }
          
              // Append the new list for the day to the container
              container.append(newList);
            }
          }
          generateLists();

          
          

        } else {
            throw new Error("Invalid city data. Please try again.");
        }
      })
      .catch((error) => {
          console.error("Error:", error);
          alert("Error fetching weather data. Please try again.");
      });
}

  

  // Search bar function to collect search

  let search = $("#search-box");
  let submit = $("#search-submit");

  submit.on("click", function () {
    event.preventDefault();
    let searchInput = search.val();
    const city = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);

    // Add search to recent searches & local storage
    if (searchInput !== "") {
    
    // Run data functions
      getCityCoords(city)
    .then((coords) => {
        // Once city coordinates are obtained, call getWeatherData
      return getWeatherData(coords.lat, coords.lon);
    })
    .catch((error) => {
        // Handle errors
        console.error("Error: Failed to call API", error);
        
        alert("Error fetching city coordinates. Please try again.");
    });

      
      
      // If it's a valid city and not a duplicate search, push it to recent searches
      const last10 = [];
      let searchCount = localStorage.getItem("searchCount") || 0;
  
        for (let index = searchCount; index > Math.max(searchCount - 10, 0); index--) {
          
          const recent = localStorage.getItem(index);
          if(recent){
            last10.push(recent)
          }
        };
      //  If the city was in the last 10 searches do not add to recent searches
      if (last10.includes(city)){
        last10.length = 0;
        return;
      }else{
        last10.length = 0;
        recentSearches.push(city);
        updateRecentSearches(); 
      }

      // Set search count and push search to local storage
      searchCount++;
      localStorage.setItem("searchCount", searchCount);
      const searchKey = `${searchCount}`;
      localStorage.setItem(searchKey, city);

      
      

    } else {
      alert("Search cannot be blank");
    }
  });

});
