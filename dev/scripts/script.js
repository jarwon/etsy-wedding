// pseudocode:
// Landing page: user types in their location (city) into the input field (additional option if there's time: use a geolocation api to get their location)
// On form submit, get the value of the user's location input and store that in a variable 
// After user inputs their location, show different wedding product categories and have the user select which category of wedding products they want to look at - store that in a category variable
// Plug in the location variable and category variable to the ajax request to get listings of wedding products from etsy in their location
// Display those listings to the page & subcategories list to allow them to further narrow down product listings if they wish
// If user chooses a subcategory, filter results to show only products in the chosen subcategory
// ? Provide option to sort listings by: distance, price, etc.
// If user clicks on a listing, it will bring them to the corresponding etsy listing page


const etsyApp = {};

//global variables
etsyApp.key = "wdcbm8dnlafybh8oonqlw3xr";
etsyApp.lat = 0;
etsyApp.lon = 0;

//initializes app
etsyApp.init = function() {
	etsyApp.userGPS();
	// etsyApp.getLocalListings();
};

//place user location using GPS in a variable etsyApp.userGPS
etsyApp.userGPS = function() {
	navigator.geolocation.getCurrentPosition(function(userPosition){
		//calling the function listed below
		etsyApp.userLocation(userPosition);
	});
}

//get user location based on navigator GPS and storing the lon and lat in global variables to be used later
etsyApp.userLocation = function(userPosition){
		console.log(userPosition);
	etsyApp.lat = userPosition.coords.latitude;
	etsyApp.lon = userPosition.coords.longitude;
	console.log(etsyApp.lat, etsyApp.lon);
	etsyApp.getLocalListings();
};

//getting listings using user GPS location
etsyApp.getLocalListings = function() {
	$.ajax({
		url: "http://proxy.hackeryou.com",
		method: "GET",
		dataType: "json",
		data: {
			reqUrl: "https://openapi.etsy.com/v2/listings/active",
			params: {
				api_key: etsyApp.key,
				category: "weddings",
				// location: "toronto",
				lat: etsyApp.lat,
				lon: etsyApp.lon,
				// sort_on: "price"
				// page: 2
			},
			xmlToJSON: false
		}
	}).then(function(res) {
		console.log(res);
	});
}



		// $.ajax ({
		// 	url: 'http://proxy.hackeryou.com',
		// 	method: "GET",
		// 	dataType: "json",
		// 	data: {
		// 		reqUrl: `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
		// 		params: {
		// 			types: "(cities)",
		// 			key: "AIzaSyCCRXx-ZdsU3noOG85WmlHlNyxMkCXP3vk",
		// 			input: "",
		// 			language: "en",
		// 		} //params closing
		// 	} //data closing
		// }).then(function(res){
		// 	console.log(res);
		// })




$(function() {
	etsyApp.init();
});