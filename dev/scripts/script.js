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

etsyApp.key = "wdcbm8dnlafybh8oonqlw3xr";

etsyApp.init = function() {
	etsyApp.getWeddingCategory();
	etsyApp.getLocalListings();
}

etsyApp.getWeddingCategory = function() {
	$.ajax({
		url: "http://proxy.hackeryou.com",
		method: "GET",
		dataType: "json",
		data: {
			reqUrl: "https://openapi.etsy.com/v2/categories/weddings",
			params: {
				api_key: etsyApp.key
			},
			xmlToJSON: false
		}
	}).then(function(res) {
		res = res.results[0];
		console.log(res);
	});
};

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
				location: "Toronto"
			},
			xmlToJSON: false
		}
	}).then(function(res) {
		console.log(res);
	});
}


$(function() {
	etsyApp.init();
});