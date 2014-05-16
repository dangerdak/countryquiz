window.onload = function(){
"use strict";
	displayQuestion(0);
};

var inject = {
	//Insert the name of the country which the question is about
	country: function(questionNumber) {
		"use strict";
		var element = document.getElementById("country");
		var country = document.createTextNode(questions[questionNumber].countryName);
		element.appendChild(country);
	},
	//Insert the options available for a given country
	options: function(questionNumber) {
		"use strict";
		var elements = document.getElementsByClassName("options");
		for(var i=0, len = questions.length; i<len; i++) {
			var option = document.createTextNode(questions[questionNumber].options[i]);
			elements[i].appendChild(option);
		}
	},
	//Display question number on page (input should be one greater than array index)
	number: function(questionNumber) {
		"use strict";
		var element = document.getElementById("questionNumber");
		var number = document.createTextNode(questionNumber + ". ");
		element.appendChild(number);

	}

};

// Apply a question out of the array "questions"
function displayQuestion(questionNumber) {
	"use strict";
	inject.number(questionNumber + 1);
	inject.country(questionNumber);	
	inject.options(questionNumber);
}


// List of objects. Each object represents a country.
var questions = 
	[
{
	countryName: "Canada",
	capital: "Ottawa",
	options: ["Toronto", "London", "Ottawa", "Ontario"]
},
{
	countryName: "Switzerland",
	capital: "Bern",
	options: ["Zurich", "Helsinki", "Basel", "Bern"]
},
{
	countryName: "Latvia",
	capital: "Riga",
	options: ["Riga", "Vilnius", "Port Louis", "Tallin"]
},
{
	countryName: "France",
	capital: "Paris",
	options: ["Versaille", "Paris", "Berlin", "Nice"]
},
{
	countryName: "Ukraine",
	capital: "Kiev",
	options: ["Minsk", "Helsinki", "Kiev", "St Petersbourg"]
}

	];
				
