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
etsyApp.subCategoryListings;
etsyApp.cat = "";

//initializes app
etsyApp.init = function() {
	etsyApp.getLocation();
	etsyApp.changeLocation();
};

// Landing page: Get user's location either by device's navigator geolocation if access allowed OR from user's location text input if they deny access to navigator geolocation
etsyApp.getLocation = function() {
	
	$("button.findGeolocation").on("click", function(e) {
		e.preventDefault();

		navigator.geolocation.getCurrentPosition(function(userPosition) {
		// If user allows access to navigator geolocation, then run ajax request using their longitude & latitude coordinates
			console.log("location access allowed");
			etsyApp.userLocation(userPosition);

			$("section.categories").css("display", "block");
			$('html, body').animate({
		         scrollTop: $("#categories").offset().top
		    }, 1000);
		}, function(error) {
		// If user denies access to geolocation, then run ajax request using their location text input
			console.log("location access denied");
		});
	});

	$(".locationSubmit").on("click", function() {		
		etsyApp.getUserInput();

		$("section.categories").css("display", "block");
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
	
	// remove any prior listening events
	$(".squareCategory").off("click");
  	etsyApp.catClickListener();
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
		
		// remove any prior listening events
		$(".squareCategory").off("click");
	  	etsyApp.catClickListener();
	});
};

// user selects subcatagory from gallery, AJAX function is called to obtain results of selection
etsyApp.catClickListener = function() {
	//bring user to category page on click
	$(".squareCategory").on("click", function() {
		//on click of category, get id of category 
		etsyApp.cat = $(this).attr("id");
			//clicked category
			console.log(etsyApp.cat);
		etsyApp.getCategory(etsyApp.lat, etsyApp.lon, etsyApp.userInputLocation, etsyApp.selectedPg);
	
	});	
}

// user selects subcatagory from sidebar option, AJAX function
etsyApp.sidebarCatListener = function() {
	$(".sidebarCat").on("click", function() {
		//on click of category, get id of category 
		console.log("THIS", this, $(this))
		// return class attribute (first word only - from index 0 to first space)
		etsyApp.cat = $(this).attr("class").substr(0, $(this)[0].className.indexOf(" "));
		// reset pg number to 1, location selection remains same
		etsyApp.selectedPg = 1;
			//clicked category
			console.log('i was clicked', etsyApp.cat);
		etsyApp.getCategory(etsyApp.lat, etsyApp.lon, etsyApp.userInputLocation, etsyApp.selectedPg);
	});	
}

// user selects subcatagory from unhidden nav sidebar option, AJAX function
etsyApp.navSidebarCatListener = function() {
	$(".navSidebarCat").on("click", function() {
		//on click of category, get id of category 
		console.log("THIS", this, $(this))
		// return class attribute (first word only - from index 0 to first space)
		etsyApp.cat = $(this).attr("class").substr(0, $(this)[0].className.indexOf(" "));
		// reset pg number to 1, location selection remains same
		etsyApp.selectedPg = 1;
			//clicked category
			console.log('i was clicked', etsyApp.cat);
		etsyApp.getCategory(etsyApp.lat, etsyApp.lon, etsyApp.userInputLocation, etsyApp.selectedPg);
	
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
			// console.log("first");
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

// determine what buttons will be generated
var genPgNumOptionsDisplay = function(currentNum, totPgs) {
	// console.log('made it to gen pg num display options');
	// if either of first three pages are selected
	if (currentNum === 1 || currentNum === 2 || currentNum === 3) {
		// console.log('made it to pg 1 of button options');
		// make an array of the total page numbers, RHS arrow will exist, no LHS (default LHS)
		etsyApp.currentPgNums = [1, 2, 3, 4, 5];
		etsyApp.showRHSarrow = true;
	}
	// if last page is selected
	else if (currentNum === totPgs) {
		for (var i = 4 ; i >= 0 ; i = i - 1) {
			var pushNum = totPgs - i;
			// make an array of the total page numbers, LHS arrow will exist, no RHS (default RHS)
			etsyApp.currentPgNums.push(pushNum);
			etsyApp.showLHSarrow = true;
		}
	}
	//if second last page is selected
	else if (currentNum === totPgs - 1) {
		for (var i = 3 ; i >= -1 ; i = i - 1) {
			var pushNum = totPgs - i;
			// make an array of the total page numbers, LHS arrow will exist, no RHS (default RHS)
			etsyApp.currentPgNums.push(pushNum);
			etsyApp.showLHSarrow = true;
		}
	}
	//if third last page is selected
	else if (currentNum === totPgs - 2) {
		for (var i = 2 ; i >= -2 ; i = i - 1) {
			var pushNum = totPgs - i;
			// make an array of the total page numbers, LHS arrow will exist, no RHS (default RHS)
			etsyApp.currentPgNums.push(pushNum);
			etsyApp.showLHSarrow = true;
		}
	}
	// if any other pg number is selected
	else {
		for (var i = -2 ; i < 3 ; i = i + 1) {
			// console.log("current num", currentNum, i, currentNum + i)
			var pushNum = currentNum + i;
			// make an array of the total page numbers, both LHS and RHS arrows will exist
			etsyApp.currentPgNums.push(pushNum);
			etsyApp.showRHSarrow = true;
			etsyApp.showLHSarrow = true;
		}
	};
	// console.log("about to call create Screen Buttons", etsyApp.currentPgNums);
	// call create screen buttons with array as parameter
	createScreenButtons(etsyApp.currentPgNums);
}
	
// create buttons in DOM (incl event listeners) based on values in currentPgNums array
var createScreenButtons = function(pgNumArray) {
	// console.log("made into call create Screen Buttons", etsyApp.currentPgNums);
	// console.log("**", pgNumArray);

	// if LHS should exist, creat LHS arrow in DOM and add event listener
	if (etsyApp.showLHSarrow) {
		var leftArrowButton = $("<button>").addClass("pgArrow pgArrow-LHS").text("<");
		// if LHS arrow is clicked
		 // make selected pg number the current value - 1 (which is element id 1 in array, element id 2 (middle) element is current pg selected)
		 // call new ajax request for prev pg hits
		leftArrowButton.on('click', function() {
			etsyApp.selectedPg = pgNumArray[1];
			etsyApp.getCategory(etsyApp.lat, etsyApp.lon, etsyApp.userInputLocation, pgNumArray[1]);
		});

		$(".pgNumButtonsContainer").append(leftArrowButton);
	}

	// create a button & event listener for each pg number option
	 // make selected pg number (element) the current value
	 // call new ajax request for selected pg number (element)
	for (var i = 0; i < pgNumArray.length; i = i + 1) {
		// console.log('made it into for loop to generate array');
		let theButtonNum = pgNumArray[i];

		// console.log('selected pg', etsyApp.selectedPg);
		// console.log('button num', pgNumArray[i]);

		if ( pgNumArray[i] === etsyApp.selectedPg) {
			var pgButton = $("<button>").addClass("pgButton currentPg").text(theButtonNum);
		}
		else {
			var pgButton = $("<button>").addClass("pgButton").text(theButtonNum);
		}

		// console.log(">>", theButtonNum)
		// console.log('going to assign on click to buttons');
		pgButton.on('click', function() {
			console.log('i was clicked');
			etsyApp.selectedPg = theButtonNum;
			// console.log("x", pgNumArray[i]);
			etsyApp.getCategory(etsyApp.lat, etsyApp.lon, etsyApp.userInputLocation, theButtonNum);
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
			etsyApp.getCategory(etsyApp.lat, etsyApp.lon, etsyApp.userInputLocation, pgNumArray[3]);
		});
		$(".pgNumButtonsContainer").append(rightArrowButton);
	}
}

// Get local etsy listings based on the chosen category
etsyApp.getCategory = function(lat, lon, userInputLocation, currentPg) {
	
	// clear any existing categoryItems div
	$(".categoryItems").empty();
	console.log('category', etsyApp.cat);

		$.ajax({
			url: "https://proxy.hackeryou.com",
			method: "GET",
			dataType: "json",
			data: {
				reqUrl: "https://openapi.etsy.com/v2/listings/active",
				params: {
					api_key: etsyApp.key,
					category: 'Weddings/' + etsyApp.cat,
					tags: "Wedding",
					lat: lat,
					lon: lon,
					location: userInputLocation,
					// sort_on: "price"
					page: currentPg,
					limit: 9
				},
				xmlToJSON: false
			}
		}).then(function(listings){

			etsyApp.subCategoryListings = listings.results;

			for (let i = 0; i < etsyApp.subCategoryListings.length; i++) {
				var itemListingID = etsyApp.subCategoryListings[i].listing_id;
			
				$.ajax({
					url: "https://proxy.hackeryou.com",
					method: "GET",
					dataType: "json",
					data: {
						reqUrl: `https://openapi.etsy.com/v2/listings/${itemListingID}/images`,
						params: {
							api_key: etsyApp.key,
							category: 'Weddings/' + etsyApp.cat,
							tags: "Wedding",
							lat: lat,
							lon: lon,
							location: userInputLocation,
							// sort_on: "price"
							page: currentPg,
							limit: 9
						},
						xmlToJSON: false
					}
				}).then(function(images){
	
					var itemListingImage = images.results[0].url_fullxfull;
					
					let catTitle = etsyApp.subCategoryListings[i].title;
					console.log('cat title', catTitle);
					console.log(catTitle.length);


					if (catTitle.length > 100) {
						catTitle = catTitle.substring(0,100).concat("...");
					}

					if (window.matchMedia('(max-width: 650px)').matches) {
						if (catTitle.length > 50) {
						catTitle = catTitle.substring(0,50).concat("...");
					}
					    }

					console.log(images.results[0]);

					$(".categoryItems").append(`
						<div class="eachItem">
							<a href="${etsyApp.subCategoryListings[i].url}"><img src="${itemListingImage}"></a>
							<h4>${catTitle}</h4>
							<p>$${etsyApp.subCategoryListings[i].price}</p>
						</div>
					`);
						$(".currentlyViewing").text(etsyApp.cat);
				});
			}

			$("section.listings").css("display", "block");
			$('html, body').animate({
		         scrollTop: $("#listings").offset().top
		    }, 1000);

		    var homeHeight = $("section.home").outerHeight();
		    var categoriesHeight = $("section.categories").outerHeight();
 
		    $(window).on("scroll", function() {
		    	if ($(window).scrollTop() >= (homeHeight + categoriesHeight)) {
		    		$("aside").css("position", "fixed");
		    	} else {
		    		$("aside").css("position", "static");
		    	}
		    });

		    // quantity of search results
			var totNumOfHits = listings.count;
			// number of search results per page
			var totNumOfHitsPerPg = listings.params.limit;
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
			
			// call check page numbers function
			chkPgNums(totNumOfPgs);

				// set-up listeners for sidebar categories selectors, clear any existing
				$(".sidebarCat").off("click"); 
				$(".navSidebarCat").off("click"); 
				etsyApp.sidebarCatListener();

			if (window.matchMedia('(max-width: 768px)').matches) {

			// 	// set-up listeners for unhidden nav sidebar categories selectors, clear any existing
				$(".sidebarCat").off("click"); 
				$(".navSidebarCat").off("click"); 
				etsyApp.navSidebarCatListener();
			}

			// set-up listeners for user price range selection
		    etsyApp.getPriceRange();
		});
}

// Get values of user's price range to narrow down listings
etsyApp.getPriceRange = function() {

	$(".priceRange").on("submit", function(e) {
		e.preventDefault();

		var priceMin = $("#minPrice").val();
		var priceMax = $("#maxPrice").val();
		console.log(`min price: $${priceMin}, max price: $${priceMax}`);
		$("input[type=number]").val("");

		let subCategoryListings = etsyApp.subCategoryListings;
		var listingsInPriceRange = subCategoryListings.filter(function(listing) {
			var price = parseFloat(listing.price);
			return price >= priceMin && price <= priceMax;
		});
		console.log("listings in price range", listingsInPriceRange);

		$(".categoryItems").empty();
		listingsInPriceRange.forEach(function(listing) {
			console.log(listing);
			$(".categoryItems").append(`
				<div class="eachItem">
					<a href="${listing.url}"><img src="${itemListingImage}"></a>
					<h4>${listing.title}</h4>
					<p>$${listing.price}</p>	
				</div>
			`);
		});

	});
}

// Change location sidebar form
etsyApp.changeLocation = function() {
	$("#formSidebar").on("submit", function(e) {
		e.preventDefault();

		etsyApp.userInputLocation = $("#formSidebar input[id='locationNew']").val();
		$("#formSidebar input[id='locationNew']").val("");
		console.log(`new location: ${etsyApp.userInputLocation}`);
		// reset defaults
		etsyApp.lat = undefined;
		etsyApp.lon = undefined;
		etsyApp.selectedPg = 1;
		etsyApp.cat = "";

	    // go to categories section and wait for user to select new category (call click listener)
		$("section.categories").css("display", "block");
		$('html, body').animate({
	         scrollTop: $("#categories").offset().top
	    }, 1000);

		// remove any prior listening events
		$(".squareCategory").off("click");
	    etsyApp.catClickListener();

	});
}

$(function() {
	etsyApp.init();
});