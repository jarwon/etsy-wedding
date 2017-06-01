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
etsyApp.selectedPg = 1;
etsyApp.currentPgNums = [];
etsyApp.showLHSarrow = false;
etsyApp.showRHSarrow = false;

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
	etsyApp.getLocalListings(etsyApp.currentPg);
};

//getting listings using user GPS location
etsyApp.getLocalListings = function(currentPg) {
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
		// if quantity of seach results does not go evenly into number of search results per pg, add + extra pg to cover the remainder
		// use math.floor to avoid decimal place results/round up. 
		else {
			var totNumOfPgs = Math.floor(totNumOfHits / totNumOfHitsPerPg) + 1;
		}

		// clear any existing related buttons, arrows and pgNum arrays
		clearExisting();

		console.log("****", etsyApp.currentPgNums);
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
		for (var i = 0 ; i < totPgs ; i = i + 1) {
			console.log("first");
			var pushNum = i;
			// make an array of the total page numbers
			etsyApp.currentPgNums.push(pushNum);
			// call create screen buttons with array as parameter
			createScreenButtons(etsyApp.currentPgNums);
		} 
	} else {
		console.log("second", etsyApp.selectedPg, totPgs);
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

	}
	console.log(">", etsyApp.currentPgNums)
	// call create screen buttons with array as parameter
	createScreenButtons(etsyApp.currentPgNums);
}

// create buttons in DOM (incl event listeners) based on values in currentPgNums array
var createScreenButtons = function(pgNumArray) {

	console.log("**", pgNumArray);

	// if LHS should exist, creat LHS arrow in DOM and add event listener
	if (etsyApp.showLHSarrow) {
		var leftArrowButton = $("<button>").addClass("pgArrow pgArrow-LHS").text("<");
		// if LHS arrow is clicked
		 // make selected pg number the current value - 1 (which is element id 1 in array, element id 2 (middle) element is current pg selected)
		 // call new ajax request for prev pg hits
		leftArrowButton.on('click', function() {
			etsyApp.selectedPg = pgNumArray[1];
			etsyApp.getLocalListings(pgNumArray[1]);
		});

		$(".pgNumButtonsContainer").append(leftArrowButton);
	}

	// create a button & event listener for each pg number option
	 // make selected pg number (element) the current value
	 // call new ajax request for selected pg number (element)
	for (var i = 0; i < pgNumArray.length; i = i + 1) {
		let theButtonNum = pgNumArray[i];

		var pgButton = $("<button>").addClass("pgButton").text(theButtonNum);

		console.log(">>", theButtonNum)

		pgButton.on('click', function() {
			etsyApp.selectedPg = theButtonNum;
			console.log("x", pgNumArray[i]);
			etsyApp.getLocalListings(theButtonNum);
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
			etsyApp.getLocalListings(pgNumArray[3]);
		});
		$(".pgNumButtonsContainer").append(rightArrowButton);
	}
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