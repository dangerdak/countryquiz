
// Generate all quiz questions using response to ajax request
//function generateQuiz(allCountries, howManyQuestions, howManyOptions) {
var quiz = {
	howManyQuestions: 5,
	howManyOptions: 4,

	answers: [],
	questions: [],

	generate: function(allCountries) {
		"use strict";

		var totalCountries = allCountries.length;
		var countryToUse;
		var countryIndex;
		var answerIndex;
		var randomCountry;

		for (var i = 0; i < this.howManyQuestions; ++i) {
			// Each array element will contain an object with info about a country
			this.questions[i] = {};
			this.questions[i].options = [];
			// Generate random indices to decide locations of answers within options
			answerIndex = Math.floor(Math.random() * this.howManyOptions);
			// Remember indices of the correct answers
			this.answers.push(answerIndex);

			// Generate random index to select country from JSON file
			countryIndex =  Math.floor(Math.random() * totalCountries);
			countryToUse = allCountries[countryIndex];

			// Set questions based on randomly chosen countries
			this.questions[i].country = countryToUse.name;

			// Generate random options (capital cities)
			// And include answer among them
				for (var j = 0; j < this.howManyOptions; ++j) {
					// Insert answer at chosen index
					if (j === answerIndex) {
						this.questions[i].options[j] = countryToUse.capital;
					} else {
						randomCountry = allCountries[Math.floor(Math.random() * totalCountries)];
						this.questions[i].options[j] = randomCountry.capital;
					}
				}
		}
	}
};

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
		quiz.generate(allCountries);
}


//// Update question
//function updateQuestion(number) {
//	// If on final question, show results page
//	if (number === questions.length
//
//}

window.onload = function() {
	"use strict";
	fetchData('countries.json', parseResponse);
};
