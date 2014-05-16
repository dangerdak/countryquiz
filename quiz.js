// List of objects. Each object represents a country.
var questions = 
	[
{
	countryName: "Canada",
	capital: "Ottawa",
	choices: ["Toronto", "London", "Ottawa", "Ontario"]
},
{
	countryName: "Switzerland",
	capital: "Bern",
	choices: ["Zurich", "Helsinki", "Basel", "Bern"]
},
{
	countryName: "Latvia",
	capital: "Riga",
	choices: ["Riga", "Vilnius", "Port Louis", "Tallin"]
},
{
	countryName: "France",
	capital: "Paris",
	choices: ["Versaille", "Paris", "Berlin", "Nice"]
},
{
	countryName: "Ukraine",
	capital: "Kiev",
	choices: ["Minsk", "Helsinki", "Kiev", "St Petersbourg"]
}

	];
	
// For placing question info into HTML document
//Insert the name of the country which the question is about
function injectCountry(questionNumber) {
	"use strict";
	var element = document.getElementById("country");
	var country = document.createTextNode(questions[questionNumber].countryName);
	element.appendChild(country);
}

//Insert the choices available for a given country
function injectChoices(questionNumber) {
	"use strict";
	var elements = document.getElementsByClassName("choices");
	for(var i=0, len = questions.length; i<len; i++) {
		var option = document.createTextNode(questions[questionNumber].choices[i]);
		elements[i].appendChild(option);
	}
}

//Display question number on page (input should be one greater than array index)
function injectNumber(questionNumber) {
	"use strict";
	var element = document.getElementById("questionNumber");
	var number = document.createTextNode(questionNumber + ". ");
	element.appendChild(number);

}

// Display, change and retrieve info from current question
var currentQuestion = {
	number: 0,
	next: function() {
		"use strict";
		this.number += 1;
	},
	display: function() {
		"use strict";
		injectNumber(this.number +1);
		injectCountry(this.number);
		injectChoices(this.number);
	},
	get country() {
		"use strict";
		return questions[this.number].countryName;
	}, 
	get choices() {
		"use strict";
		return questions[this.number].choices;
	}
};
	
window.onload = function(){
"use strict";
	currentQuestion.display();
};
