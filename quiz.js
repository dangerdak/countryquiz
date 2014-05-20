function AJAX_JSON_Req( url ) {
    var AJAX_req = new XMLHttpRequest();
    AJAX_req.open( "GET", url, true );
    AJAX_req.setRequestHeader("Content-type", "application/json");
 
    AJAX_req.onreadystatechange = function() {
        if(AJAX_req.readyState == 4 && AJAX_req.status == 200) {
            var response = JSON.parse(AJAX_req.responseText);
			generateQuestions(response);
        }
    }
    AJAX_req.send();
}

// Generate questions using response to ajax request
function generateQuestions(response) {
	"use strict";
	var howManyQuestions = 5;
	var howManyOptions = 4;
	var totalCountries = response.length;
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
		countriesToUse[i] = response[countryIndex];

		// Set questions based on randomly chosen countries
		questions[i].country = countriesToUse[i].name;

		// Generate random options
		// And include answer among them
		for (var j = 0; j < howManyOptions; ++j) {
			// Insert answer at chosen index
			if (j === answerIndex) {
				options[j] = countriesToUse[i].capital;
			} else {
				options[j] = response[Math.floor(Math.random() * totalCountries)].capital;
			}
		}
		questions[i].options = options;
	}
	return {questions: questions, answers: answerIndices};
}

window.onload = function() {
	"use strict";
	AJAX_JSON_Req('countries.json');
};
