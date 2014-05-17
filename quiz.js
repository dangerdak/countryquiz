// List of objects. Each object represents a country.
var questions = 
[
	{
		countryName: "Canada",
		capital: "Ottawa",
		options: ["Toronto", "London", "Ottawa", "Ontario"],
		answer: 2
	},
	{
		countryName: "Switzerland",
		capital: "Bern",
		options: ["Zurich", "Helsinki", "Basel", "Bern"],
		answer: 3
	},
	{
		countryName: "Latvia",
		capital: "Riga",
		options: ["Riga", "Vilnius", "Port Louis", "Tallin"],
		answer: 0
	},
	{
		countryName: "France",
		capital: "Paris",
		options: ["Versaille", "Paris", "Berlin", "Nice"],
		answer: 1
	},
	{
		countryName: "Ukraine",
		capital: "Kiev",
		options: ["Minsk", "Helsinki", "Kiev", "St Petersbourg"],
		answer: 2
	}

];

/****** OH NO! Globals!*/
var questionNumber = 0;
var currentQuestion = questions[questionNumber];


/****** DOM stuff ******/
// Returns 3 objects in an array
function collectElements() {
	"use strict";
	var numberingElt = document.getElementById("questionNumber");
	var countryElt = document.getElementById("country");
	var optionsElts = document.getElementsByClassName("choices");

	return [numberingElt, countryElt, optionsElts];
}

// Returns 3 textnodes in an array
function createText() {
	"use strict";
	var numberingText = document.createTextNode(questionNumber + 1 + ". ");
	var countryText = document.createTextNode(currentQuestion.countryName);
	var optionsText = [];
	for (var i = 0; i < questions.length; ++i) {
		optionsText[i] = document.createTextNode(currentQuestion.options[i]);
	}
	return [numberingText, countryText, optionsText];
}

// Takes 3 text nodes and 3 element objects
function insertText(numberingText, countryText, optionsText, numberingElt, 
		countryElt, optionsElts) {
	"use strict";
	numberingElt.appendChild(numberingText);
	countryElt.appendChild(countryText);
	for (var i = 0; i < optionsElts.length; ++i) {
		optionsElts[i].appendChild(optionsText[i]);
	}
}

window.onload = function() {
	"use strict";
	var elements = collectElements();
	var text = createText();
	insertText(text[0], text[1], text[2], elements[0], elements[1], elements[2]);

};
