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
    



//search bar function to collect search 

let search = $("#search-box");
let submit = $("#search-submit");
   
    
submit.on("click", function (city) {
    let searchInput = search.val();
    city = searchInput.charAt(0).toUpperCase() + searchInput.slice(1);
    console.log(city);
    

    if (search.val() !== "" ){
        recentSearches.push(city);
        updateRecentSearches();
        localStorage.setItem("search", city);
    }else{
        alert("Search cannot be blank");
    }
    
});


 
    
//geocoding api call


//weather api call



});

