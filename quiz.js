var quiz = [];

// AJAX request for country data in file at url
function fetchData(url, responseHandler) {
    var request = new XMLHttpRequest();
    request.open( "GET", url, true );
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status === 200) {
			responseHandler(request.responseText);
		}
	};
    request.send();
}

function parseResponse(responseText) {
		// Put all country data in a global variable
		var allCountries = JSON.parse(responseText);
		quiz = generateQuiz(allCountries);
}

// Generate all quiz questions using response to ajax request
function generateQuiz(allCountries, howManyQuestions, howManyOptions) {
	"use strict";

	// Set default values
	howManyQuestions = howManyQuestions || 5;
	howManyOptions = howManyOptions || 4;

	var totalCountries = allCountries.length;
	var countriesToUse = [];
	var options = [];
	var questions = [];
	var countryIndex;
	var answerIndex;
	var answerIndices = [];


	for (var i = 0; i < howManyQuestions; ++i) {
		// Each array element will contain an object with info about a country
		questions[i] = {};
		// Generate random indices to decide locations of answers within options
		answerIndex = Math.floor(Math.random() * howManyOptions);
		// Remember indices of the correct answers
		answerIndices.push(answerIndex);

		// Generate random indices to select countries from JSON file
		countryIndex =  Math.floor(Math.random() * totalCountries);
		countriesToUse[i] = allCountries[countryIndex];

		// Set questions based on randomly chosen countries
		questions[i].country = countriesToUse[i].name;

		// Generate random options (capital cities)
		// And include answer among them
			for (var j = 0; j < howManyOptions; ++j) {
				// Insert answer at chosen index
				if (j === answerIndex) {
					options[j] = countriesToUse[i].capital;
				} else {
					options[j] = allCountries[Math.floor(Math.random() * totalCountries)].capital;
				}
			}
		questions[i].options = options;
	}
	return {questions: questions, answers: answerIndices};
}

window.onload = function() {
	"use strict";
	fetchData('countries.json', parseResponse);
};
