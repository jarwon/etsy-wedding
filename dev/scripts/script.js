// pseudocode:
// After user inputs their location, show different wedding product categories and have the user select which category of wedding products they want to look at - store that in a category variable
// Plug in the location variable and category variable to the ajax request to get listings of wedding products from etsy in their location
// Display those listings to the page & subcategories list to allow them to further narrow down product listings if they wish
// If user chooses a subcategory, filter results to show only products in the chosen subcategory
// ? Provide option to sort listings by: distance, price, etc.
// If user clicks on a listing, it will bring them to the corresponding etsy listing page


const etsyApp = {};

//global variables 
etsyApp.key = "wdcbm8dnlafybh8oonqlw3xr";

//initializes app
etsyApp.init = function() {
	etsyApp.getLocation();
};


// Landing page: Get user's location either by device's navigator geolocation if access allowed OR from user's location text input if they deny access to navigator geolocation
etsyApp.getLocation = function() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(userPosition) {
		// If user allows access to navigator geolocation, then run ajax request using their longitude & latitude coordinates
			console.log("location access allowed");
			etsyApp.userLocation(userPosition);
		}, function(error) {
		// If user denies access to geolocation, then run ajax request using their location text input
			console.log("location access denied");
			etsyApp.getUserInput();
		});
	};
};


// Get user's location via navigator geolocation (longitude & latitude coordinates)
etsyApp.userLocation = function(userPosition){
	console.log(userPosition);
	var lat = userPosition.coords.latitude;
	var lon = userPosition.coords.longitude;
	var userInputLocation = null;
	console.log(lat, lon);
	// console.log(typeof userPosition.coords.heading);

	// Run ajax request function only after you have the user's location
	etsyApp.getLocalListings(lat, lon, userInputLocation);
};


// Get user's location from text input field (city name - can be more specific if they wish, e.g. "Sydney, Australia"; just "Sydney" gives listings from Sydney, Nova Scotia)
etsyApp.getUserInput = function() {
	$("form").on("submit", function(e) {
		e.preventDefault();

		var userInputLocation = $("input[id='location']").val();
		$("input[id='location']").val("");
		console.log(userInputLocation);
		var lat = undefined;
		var lon = undefined;

		// Run ajax request function only after you have the user's location
		etsyApp.getLocalListings(lat, lon, userInputLocation);
	});
};


// Get etsy listings based on user location (either latitude & longitude coordinates from geolocation OR from location text input if user denied access to geolocation)
etsyApp.getLocalListings = function(lat, lon, userInputLocation) {
	
	$.ajax({
		url: "http://proxy.hackeryou.com",
		method: "GET",
		dataType: "json",
		data: {
			reqUrl: "https://openapi.etsy.com/v2/listings/active",
			params: {
				api_key: etsyApp.key,
				category: "weddings",
				lat: lat,
				lon: lon,
				location: userInputLocation
				// sort_on: "price"
				// page: 2
			},
			xmlToJSON: false
		}
	}).then(function(res) {
		console.log(res);
	});
};



// Get values of user's price range to narrow down listings
etsyApp.getPriceRange = function() {
	// input id's TBD/changed based on HTML
	var priceMin = $("input[id='priceMin']").val();
	var priceMax = $("input[id='priceMax']").val();

	// Pass price range values to ajax to narrow down listings
}


$(function() {
	etsyApp.init();
});