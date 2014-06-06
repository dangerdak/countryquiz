// Shuffle elements of array into random order
// Using Fisher-Yates algorithm.
// Returns shuffled array
function shuffle(array) {
	"use strict";
  var currentIndex = array.length;
  var temporaryValue;
  var randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Returns random index for array
function randomIndex(arrayLength) {
	"use strict";
	return Math.floor(Math.random() * arrayLength);
}

// Returns random element from array
function randomElement(array) {
	"use strict";
	return array[randomIndex(array.length)];
}

// Returns true if element is member of array
function isMemberOf(array, element) {
	"use strict";
	if (array.indexOf(element) === -1) {
		return false;
	}
	else {
		return true;
	}
}

// Generate content for a single question page
function QuestionPage(numberOptions, countryObject, allCountryObjects) {
	"use strict";
	var preamble = "What's the capital of ";
	var postamble = "?";
	var subject = countryObject.name;
	// Store ordered options in here
	var tempOptions = [];
	// Before shuffling them into here
	this.options = [];

	// Add capital city to options
	tempOptions[0] = countryObject.capital;

	// Add largest cities to options, if they exist
		var cityIndex = 0;
		var optionsIndex = 1;
		while (cityIndex < (countryObject.largestCities).length) {
			// Don't duplicate capital
			if (countryObject.largestCities[cityIndex] !== countryObject.capital) {
				tempOptions[optionsIndex] = countryObject.largestCities[cityIndex];
				cityIndex += 1;
				// Only increment if option was accepted
				optionsIndex += 1;
			}
			else {
				// Always increment
				cityIndex += 1;
			}
		}

	// Add random cities to fill up remaining options
	var randomCapital;
	var startLength = tempOptions.length;
	var remaining = numberOptions - tempOptions.length;
	for (var i = 0; i < remaining; ++i) {
		do {
			randomCapital = randomElement(allCountryObjects).capital;
		}
		// Avoid duplicates and empty options
		while ((randomCapital === countryObject.capital) ||
				(isMemberOf(tempOptions, randomCapital) ||
				 !(randomCapital)));

		tempOptions[startLength + i] = randomCapital;
	}
	
	this.options = shuffle(tempOptions);
}

function parseJSONResponse(responseText) {
	"use strict";
	// Put all country data in a global variable
	var allCountries = JSON.parse(responseText);
	var page = new QuestionPage(5, allCountries[0], allCountries);
	console.log(page.options);
}

// AJAX request for country data in file at url
function fetchData(url, responseHandler) {
	"use strict";
	var request = new XMLHttpRequest();
	request.open("GET", url, true);
	request.setRequestHeader("Content-type", "application/json");
	request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status === 200) {
			responseHandler(request.responseText);
		}
	};
	request.send();
}
window.onload = function() {
	"use strict";
	fetchData('newCountries.json', parseJSONResponse);
};
