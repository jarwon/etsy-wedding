const etsyApp = {};

etsyApp.init = function() {
	etsyApp.getApiData();
}

etsyApp.getApiData = function() {
	$.ajax({
		url: "http://proxy.hackeryou.com",
		method: "GET",
		dataType: "json",
		data: {
			reqUrl: "https://openapi.etsy.com/v2/listings/active",
			params: {
				api_key: "wdcbm8dnlafybh8oonqlw3xr",
				category: "weddings",
				location: "Toronto"
			},
			xmlToJSON: false
		}
	}).then(function(res) {
		console.log(res);
	});
};

$(function() {
	etsyApp.init();
});