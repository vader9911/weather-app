document.addEventListener('DOMContentLoaded', function () {


const apiKey = "fef58a10c0df34dec267d61fe76ef6af";



let recentSearches = [];

// Function to update the recent searches list
function updateRecentSearches() {
    let searchList = $("#recent-searches");
    searchList.empty();
    recentSearches = recentSearches.slice(-10);
    for (let i = 0; i < recentSearches.length; i++) {
        $("<li class='list-group-item py-3 '>" + recentSearches[i] + "</li>").appendTo(searchList);
        }

}
    

//weather api call
function getWeatherData(city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                alert("City not found, please check spelling and try again")
                throw new Error(`HTTP error! Status: ${response.status}`);
                
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}






//search bar function to collect search 

let search = $("#search-box");
let submit = $("#search-submit");
   
    
submit.on("click", function () {
    let searchInput = search.val();
    const city = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);
    console.log(city);

    //add search to recent searches & local storage
    if (searchInput !== "") {
        getWeatherData(city);

        let searchCount = localStorage.getItem("searchCount") || 0;
        searchCount++;
        localStorage.setItem("searchCount", searchCount);
        const searchKey = `search${searchCount}`;
        localStorage.setItem(searchKey, city);

        recentSearches.push(city);
        updateRecentSearches();
        
    } else {
        alert("Search cannot be blank");
    }
});


 
    
//geocoding api call






});

