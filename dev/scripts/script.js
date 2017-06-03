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
etsyApp.userInputLocation = "";
etsyApp.lat = undefined;
etsyApp.lon = undefined;
etsyApp.selectedPg = 1;
etsyApp.currentPgNums = [];
etsyApp.showLHSarrow = false;
etsyApp.showRHSarrow = false;
// var imageURL = "https://openapi.etsy.com/v2/listings/active.js?includes=MainImage"

//initializes app
etsyApp.init = function() {
	etsyApp.getLocation();
};


// Landing page: Get user's location either by device's navigator geolocation if access allowed OR from user's location text input if they deny access to navigator geolocation
etsyApp.getLocation = function() {
	
	$("button.findGeolocation").on("click", function() {

		navigator.geolocation.getCurrentPosition(function(userPosition) {
		// If user allows access to navigator geolocation, then run ajax request using their longitude & latitude coordinates
			console.log("location access allowed");
			etsyApp.userLocation(userPosition);

			$('html, body').animate({
		         scrollTop: $("#categories").offset().top
		    }, 1000);
		}, function(error) {
		// If user denies access to geolocation, then run ajax request using their location text input
			console.log("location access denied");
		});
	});

	$("input[type=submit]").on("click", function() {		
		etsyApp.getUserInput();

		$('html, body').animate({
	         scrollTop: $("#categories").offset().top
	    }, 1000);
	});
};


// Get user's location via navigator geolocation (longitude & latitude coordinates)
etsyApp.userLocation = function(userPosition){
	console.log(userPosition);
	etsyApp.lat = userPosition.coords.latitude;
	etsyApp.lon = userPosition.coords.longitude;
	etsyApp.userInputLocation = null;
	console.log(etsyApp.lat, etsyApp.lon);

	// Run ajax request function only after you have the user's location
	etsyApp.getLocalListings(etsyApp.lat, etsyApp.lon, etsyApp.userInputLocation, etsyApp.currentPg);
};


// Get user's location from text input field (city name - can be more specific if they wish, e.g. "Sydney, Australia"; just "Sydney" gives listings from Sydney, Nova Scotia)
etsyApp.getUserInput = function() {
	$("#form").on("submit", function(e) {
		e.preventDefault();

		etsyApp.userInputLocation = $("input[id='location']").val();
		$("input[id='location']").val("");
		console.log(etsyApp.userInputLocation);
		etsyApp.lat = undefined;
		etsyApp.lon = undefined;

		// Run ajax request function only after you have the user's location
		etsyApp.getLocalListings(etsyApp.lat, etsyApp.lon, etsyApp.userInputLocation, etsyApp.currentPg);
	});
};


// Get etsy listings based on user location (either latitude & longitude coordinates from geolocation OR from location text input if user denied access to geolocation)
etsyApp.getLocalListings = function(lat, lon, userInputLocation, currentPg) {
	
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
				location: userInputLocation,
				// sort_on: "price"
				page: currentPg
			},
			xmlToJSON: false
		}
	}).then(function(res) {
		console.log(res);
		// quantity of search results
		var totNumOfHits = res.count;
		// number of search results per page
		var totNumOfHitsPerPg = res.params.limit;
		// if quantity of search results goes evenly into number of search results per pg
		if (totNumOfHits % totNumOfHitsPerPg === 0) {
			var totNumOfPgs = totNumOfHits / totNumOfHitsPerPg;
		}
		// if quantity of search results does not go evenly into number of search results per pg, add + extra pg to cover the remainder
		// use math.floor to avoid decimal place results/round up. 
		else {
			var totNumOfPgs = Math.floor(totNumOfHits / totNumOfHitsPerPg) + 1;
		}

		// clear any existing related buttons, arrows and pgNum arrays
		clearExisting();

		// console.log("****", etsyApp.currentPgNums);
		// call check page numbers function
		chkPgNums(totNumOfPgs);
	});
}

// clear any existing related buttons, arrows and pgNum arrays
var clearExisting = function () {
	$(".pgArrow").remove();
	$(".pgButton").remove();
	etsyApp.currentPgNums = [];
	etsyApp.showLHSarrow = false;
	etsyApp.showRHSarrow = false;
}


// we display up to 5 page numbers at a time
// check if number of pages is <5 and fill currentPgNums array
var chkPgNums = function(totPgs) {
	if (totPgs <=5 ) {
		for (var i = 1 ; i <= totPgs ; i = i + 1) {
			console.log("first");
			var pushNum = i;
			// make an array of the total page numbers
			etsyApp.currentPgNums.push(pushNum);
			// call create screen buttons with array as parameter
			createScreenButtons(etsyApp.currentPgNums);
		} 
	} else {
		// console.log("second", etsyApp.selectedPg, totPgs);
		// if there are more than 5 pages call function to determin which pg numbers to display (what numbers to fill etsyApp.currentPgNums with)
		genPgNumOptionsDisplay(etsyApp.selectedPg, totPgs);
		}
}

var genPgNumOptionsDisplay = function(currentNum, totPgs) {
	// if either of first three pages are selected
	if (currentNum === 1 || currentNum === 2 || currentNum === 3) {
		// make an array of the total page numbers, RHS arrow will exist, no LHS (default LHS)
		etsyApp.currentPgNums = [1, 2, 3, 4, 5];
		etsyApp.showRHSarrow = true;
	}
	// if either of last three pages are selected
	else if (currentNum === totPgs || currentNum === totPgs - 1 || currentNum === totPgs - 2) {
		for (var i = 4 ; i >= 0 ; i = i - 1) {
			var pushNum = totPgs - i;
			// make an array of the total page numbers, LHS arrow will exist, no RHS (default RHS)
			etsyApp.currentPgNums.push(pushNum);
			etsyApp.showLHSarrow = true;
		}
	// if any other pg number is selected
	} else {
		for (var i = -2 ; i < 3 ; i = i + 1) {
			console.log("current num", currentNum, i, currentNum + i)
			var pushNum = currentNum + i;
			// make an array of the total page numbers, both LHS and RHS arrows will exist
			etsyApp.currentPgNums.push(pushNum);
			etsyApp.showRHSarrow = true;
			etsyApp.showLHSarrow = true;
		}
	};

	// console.log(">", etsyApp.currentPgNums);
	// call create screen buttons with array as parameter
	createScreenButtons(etsyApp.currentPgNums);
}
	


// create buttons in DOM (incl event listeners) based on values in currentPgNums array
var createScreenButtons = function(pgNumArray) {

	// console.log("**", pgNumArray);

	// if LHS should exist, creat LHS arrow in DOM and add event listener
	if (etsyApp.showLHSarrow) {
		var leftArrowButton = $("<button>").addClass("pgArrow pgArrow-LHS").text("<");
		// if LHS arrow is clicked
		 // make selected pg number the current value - 1 (which is element id 1 in array, element id 2 (middle) element is current pg selected)
		 // call new ajax request for prev pg hits
		leftArrowButton.on('click', function() {
			etsyApp.selectedPg = pgNumArray[1];
			etsyApp.getLocalListings(etsyApp.lat, etsyApp.lon, etsyApp.userInputLocation, pgNumArray[1]);
		});

		$(".pgNumButtonsContainer").append(leftArrowButton);
	}

	// create a button & event listener for each pg number option
	 // make selected pg number (element) the current value
	 // call new ajax request for selected pg number (element)
	for (var i = 0; i < pgNumArray.length; i = i + 1) {
		let theButtonNum = pgNumArray[i];

		console.log('selected pg', etsyApp.selectedPg);
		console.log('button num', pgNumArray[i]);

		if ( pgNumArray[i] === etsyApp.selectedPg) {
			var pgButton = $("<button>").addClass("pgButton currentPg").text(theButtonNum);
		}
		else {
			var pgButton = $("<button>").addClass("pgButton").text(theButtonNum);
		}

		// console.log(">>", theButtonNum)

		pgButton.on('click', function() {
			etsyApp.selectedPg = theButtonNum;
			// console.log("x", pgNumArray[i]);
			etsyApp.getLocalListings(etsyApp.lat, etsyApp.lon, etsyApp.userInputLocation, theButtonNum);
		});

		$(".pgNumButtonsContainer").append(pgButton);
	}

	// if RHS should exist, creat RHS arrow in DOM and add event listener
	if (etsyApp.showRHSarrow) {
		var rightArrowButton = $("<button>").addClass("pgArrow pgArrow-RHS").text(">");
		// if RHS arrow is clicked
			// make selected pg number the current value + 1 (which is element id 3 in array, element id 2 (middle) element is current pg selected)
			 // call new ajax request for next pg hits
		rightArrowButton.on('click', function() {
			etsyApp.selectedPg = pgNumArray[3];
			etsyApp.getLocalListings(etsyApp.lat, etsyApp.lon, etsyApp.userInputLocation, pgNumArray[3]);
		});
		$(".pgNumButtonsContainer").append(rightArrowButton);
	}
}


// Get values of user's price range to narrow down listings
etsyApp.getPriceRange = function() {
	// input id's TBD/changed based on HTML
	var priceMin = $("input[id='priceMin']").val();
	var priceMax = $("input[id='priceMax']").val();
	// Pass price range values to ajax to narrow down listings
}


etsyApp.getCategory = function(lat, lon, userInputLocation, currentPg) {
	//bring user to category page on click
	$(".squareCategory").on("click", function() {
		//on click of category, get id of category and
		$(".categoryItems").empty();
		var	cat = $(this).attr("id");
			console.log(cat);

		$.ajax({
			url: "http://proxy.hackeryou.com",
			method: "GET",
			dataType: "json",
			data: {
				reqUrl: "https://openapi.etsy.com/v2/listings/active",
				params: {
					api_key: etsyApp.key,
					category: `Weddings/${cat}`,
					tags: "Wedding",
					lat: lat,
					lon: lon,
					location: userInputLocation,
					// sort_on: "price"
					page: currentPg
				},
				xmlToJSON: false
		}
	}).then(function(res){
		console.log('subcategory',res);
		for (let i = 0; i < res.results.length; i++) {
			console.log(res.results[i]);
			$(".categoryItems").append(`
				<div class="eachItem">
					<a href="${res.results[i].url}"><img src="http://via.placeholder.com/200x200"></a>
					<h4>${res.results[i].title}</h4>
					<p>$${res.results[i].price}</p>
					<p class="itemDescription">${res.results[i].description.substring(0,200)}...</p>	
				</div>
			`);
		};

		$('html, body').animate({
	         scrollTop: $("#listings").offset().top
	    }, 1000);
	});
	});
}


var itemID = res.results.listing_id
	$.ajax({
		url: "http://proxy.hackeryou.com",
		method: "GET",
		dataType: "json",
		data: {
			reqUrl: `https://openapi.etsy.com/v2/listings/${itemID}/images`,
			params: {
				api_key: etsyApp.key,
				category: `Weddings/${cat}`,
				tags: "Wedding",
				lat: lat,
				lon: lon,
				location: userInputLocation,
				// sort_on: "price"
				page: currentPg
			},
			xmlToJSON: false
	}
}).then(function(res){
	console.log(res);
})



//get results from the clicked category
//go over each object in the array
//append to container

// https://openapi.etsy.com/v2/listings/:listing_id/images/active?api_key=wdcbm8dnlafybh8oonqlw3xr

// https://openapi.etsy.com/v2/listings/:listing_id/images/active?
// listing_id
// wdcbm8dnlafybh8oonqlw3xr



//openapi.etsy.com/v2/listings/453798886/images?api_key=wdcbm8dnlafybh8oonqlw3xr


// /listings/:listing_id/images/:listing_image_id
$(function() {
	etsyApp.init();
	etsyApp.getCategory();
});