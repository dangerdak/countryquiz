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
		quiz.insertHTML();
		quiz.generate(allCountries);
}

// Generate all quiz questions using response to ajax request
var quiz = {
	howManyQuestions: 2,
	howManyOptions: 5,

	answers: [],
	questions: [],
	currentQuestion: 0,

	// !!Should insert entire element so number of options is variable
	insertHTML: function() {
		"use strict";
		var selectionArea = document.getElementById("selectionArea");
		for (var i = 0; i < quiz.howManyOptions; ++i) {
			var inputElt = document.createElement("input");
			var labelElt = document.createElement("label");
			var lineElt = document.createElement("br");
			inputElt.type = "radio";
			inputElt.name = "city";
			inputElt.className = "optionButtons";
			inputElt.id = "option" + i;
			labelElt.className = "options";
			labelElt.htmlFor = "option" + i;
			selectionArea.appendChild(inputElt);
			selectionArea.appendChild(labelElt);
			selectionArea.appendChild(lineElt);
		}
		

	},

	generate: function(allCountries) {
		"use strict";
		// Possible regions:
		var allRegions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

		var countryToUse;
		var countryIndex;
		var answerIndex;
		var randomCountry;

		var countries = setRegion(allCountries, allRegions[3]);
		var totalCountries = countries.length;

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
				countryToUse = countries[countryIndex];
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
						randomCountry = countries[Math.floor(Math.random() * totalCountries)];
						this.questions[i].options[j] = randomCountry.capital;
						}
						while (!capital(randomCountry)); 
					}
				}
		}
	}
};

function setRegion(allCountries, continent) {
	"use strict";
	var countries = [];
	// If no continent specified, can use any country
	if (!continent) {
		countries = allCountries;
	} else {
		// Pick out countries from specific continent
		allCountries.forEach(
				function(country, i, allCountries) {
					if (allCountries[i].region === continent) {
						countries.push(allCountries[i]);
					}
				});
	}
	return countries;
}

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
		optionsElt = document.getElementsByClassName("options")[i];
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
		results.table(quiz.howManyQuestions);
		for (var i = 0, len = results.userAnswers.length; i < len; ++i) {
			if (results.userAnswers[i] === quiz.answers[i]) {
				results.score += 1;
			}
		}
		document.getElementById("finalScore").textContent = results.score;
		// Display results
		document.getElementById("quizArea").style.display = "none";
		document.getElementById("resultsArea").style.display = "block";
	},

	table: function(howManyQuestions) {
		"use strict";
		var tableElt = document.createElement("table");
		var headElt = tableElt.createTHead();
		var headCell0 = document.createElement("th");
		var headCell1= document.createElement("th");
		var bodyElt = tableElt.createTBody();

		headCell0.textContent = "Country";
		headCell1.textContent = "Capital";
		headElt.appendChild(headCell0);
		headElt.appendChild(headCell1);

		for (var i = 0; i < howManyQuestions; ++i) {
			var rowElt = bodyElt.insertRow();
			rowElt.insertCell().textContent = quiz.questions[i].country;
			rowElt.insertCell().textContent = quiz.questions[i].options[quiz.answers[i]];
		}
		document.getElementById("resultsArea").appendChild(tableElt);
	}
};

function userAnswer() {
	"use strict";
	var buttons = document.getElementsByClassName("optionButtons");
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
