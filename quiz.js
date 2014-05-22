// AJAX request for country data in file at url
function fetchData(url, responseHandler) {
	"use strict";
    var request = new XMLHttpRequest();
    request.open( "GET", url, true );
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function() {
		if (request.readyState === 4 && request.status === 200) {
			responseHandler(request.responseText);
			question.next();
		}
	};
    request.send();
}

function parseJSONResponse(responseText) {
	"use strict";
		// Put all country data in a global variable
		var allCountries = JSON.parse(responseText);
		quiz.generate(allCountries);
}

// Generate all quiz questions using response to ajax request
var quiz = {
	howManyQuestions: 5,
	howManyOptions: 4,

	answers: [],
	questions: [],
	currentQuestion: 0,

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
			// Ensure capital property exists on this country
			do {
				countryIndex =  Math.floor(Math.random() * totalCountries);
				countryToUse = allCountries[countryIndex];
			}
			while (!capital(countryToUse));

			// Set questions based on randomly chosen countries
			this.questions[i].country = countryToUse.name;

			// Generate random options (capital cities)
			// And include answer among them
				for (var j = 0; j < this.howManyOptions; ++j) {
					// Insert answer at chosen index
					if (j === answerIndex) {
						this.questions[i].options[j] = countryToUse.capital;
					} else {
						// Ensure capital property exists on this country
						do {
						randomCountry = allCountries[Math.floor(Math.random() * totalCountries)];
						this.questions[i].options[j] = randomCountry.capital;
						}
						while (!capital(randomCountry)); 
					}
				}
		}
	}
};

// Check if capital property is present
function capital(country) {
	"use strict";
	if (country.capital.length > 1) {
		return true;
	} else {
		return false;
	}
}

// Information for updating question
var question = {
	number: 0,

	// Can't use "this" keyword as method will be invoked on an event handler
	// (The event object will then become "this")
	next: function() {
		"use strict";
		var warningElt = document.getElementById("warning");
		// Clear warning
		warningElt.textContent = "";
		// Only update question if an answer had been chosen
		// (Except for initial insertion of question)
		if (userAnswer() !== null || question.number === 0) {
			update();
		} else {
			warningElt.textContent = "Please select an answer before continuing!";
		}
	}

};

function update() {
	"use strict";
	var optionsElt;
	var buttonElt;
	document.getElementById("country").textContent = quiz.questions[question.number].country;
	if (question.number !== 0) {
		results.userAnswers.push(userAnswer());
	}
	for (var i = 0, len = quiz.howManyOptions; i < len; ++i) {
		optionsElt = document.getElementsByClassName("choices")[i];
		optionsElt.textContent = quiz.questions[question.number].options[i];
		// Uncheck radio button
		optionsElt.previousElementSibling.checked=false;
	}
	// Displays question number after incrementing it
	// (As it should be one greater than the index)
	document.getElementById("questionNumber").textContent = ++question.number + ". ";
	if (question.number === quiz.howManyQuestions) {
		buttonElt = document.getElementById("next");
		buttonElt.value = "Results";
		buttonElt.onclick = results.show;
	}
}
	

var results = {
	userAnswers: [],
	score: 0,
	
	show: function() {
		"use strict";
		// Insert results
		// Calculate score
		for (var i = 0, len = results.userAnswers.length; i < len; ++i) {
			if (results.userAnswers[i] === quiz.answers[i]) {
				results.score += 1;
			}
		}
		document.getElementById("finalScore").textContent = results.score;
		// Display results
		document.getElementById("quizArea").style.display = "none";
		document.getElementById("resultsArea").style.display = "block";
	}
};

function userAnswer() {
	"use strict";
	var buttons = document.getElementsByClassName("choiceButton");
	for (var i = 0; i < buttons.length; ++i) {
		if (buttons[i].checked) {
			return i;
		}
	}
	return null;
}

// Returns true if question is the last
function finalQuestion() {
	"use strict";
	if (question.number === quiz.howManyQuestions) {
		return true;
	} else {
	return false;
	}
}

window.onload = function() {
	"use strict";
	fetchData('countries.json', parseJSONResponse);
	document.getElementById("next").onclick = question.next;
};
