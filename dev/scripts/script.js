const etsyApp = {};

// etsyApp.init = function() {
// 	$.ajax({
// 		url: "https://openapi.etsy.com/v2/listings/active?api_key=wdcbm8dnlafybh8oonqlw3xr",
// 		method: "GET",
// 		dataType: "json",
// 		category: "weddings"
// 	})
// 	.then(function(data) {
// 		console.log(data);
// 	})
// }

etsyApp.init = function() {
	$.ajax({
		url: "https://openapi.etsy.com/v2/listings/active?api_key=wdcbm8dnlafybh8oonqlw3xr&category=weddings",
		method: "GET",
		dataType: "json",
	})
	.then(function(data) {
		console.log(data);
	})
}


console.log("is this working");









$(function(){
	etsyApp.init();
});