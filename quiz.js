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
// Returns object of elements 
function collectElements() {
	"use strict";
	var numberingElt = document.getElementById("questionNumber");
	var countryElt = document.getElementById("country");
	var optionsElts = document.getElementsByClassName("choices");

	return {numbering: numberingElt, country: countryElt, options: optionsElts};
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
	return {numbering: numberingText, country: countryText, options: optionsText};
}

// Takes two objects
function insertText(text, elements) {
	"use strict";
	elements.numbering.appendChild(text.numbering);
	elements.country.appendChild(text.country);
	for (var i = 0; i < elements.options.length; ++i) {
		elements.options[i].appendChild(text.options[i]);
	}
}

window.onload = function() {
	"use strict";
	var elements = collectElements();
	var text = createText();
	insertText(text, elements);

};
