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
var score = 0;


/****** Other stuff ******/
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

// Show final page
function showResults() {
	"use strict";
	var resultsElt = document.getElementById("resultsArea");
	var quizElt = document.getElementById("quizArea");
	var scoreElt = document.getElementById("finalScore");

	// Update score to include final answer
	updateScore();
	// Insert user score
	var scoreText = document.createTextNode(score);
	scoreElt.appendChild(scoreText);

	// Hide quiz area and show results area
	quizElt.style.display = "none";
	resultsElt.style.display = "block";
}

// Check if end of quiz
function finalQuestion() {
	"use strict";
	var current = questionNumber+1;
	var length = questions.length;
	if (current === length) {
		return true;
	}
	else {
		return false;
	}
}

// Increases question number
// Updates variable "currentQuestion"
// Updates content displayed on page
// (including replacing last question with results)
function updateQuestion() {
	"use strict";
	// Update globals
	questionNumber += 1;
	currentQuestion = questions[questionNumber];

	// Find elements whose content needs updating
	var text = createText();
	var elements = collectElements();
	var button = document.getElementById("next");
	var radios = document.getElementsByClassName("choiceButton");

	// Start each question with all radio buttons unchecked
	for (var j = 0; j < radios.length; ++j) {
		radios[j].checked = false;
	}

	// Update content
	elements.numbering.replaceChild(text.numbering, elements.numbering.firstChild);
	elements.country.replaceChild(text.country, elements.country.firstChild);
	for (var i = 0; i < elements.options.length; ++i) {
		elements.options[i].replaceChild(text.options[i], elements.options[i].lastChild);
	}
	// For final question, change button value to "Submit Answers" and change event
	if (finalQuestion()) {
		button.value="Submit Answers";
		button.onclick = showResults;
	}
}

// Returns index of users answer
function userAnswer() {
	"use strict";
	var radioElts = document.getElementsByClassName("choiceButton");
	for (var i = 0; i < radioElts.length; i++) {
		if (radioElts[i].checked) {
			return i;
		}
	}
}

// Increment user's score if they were correct
function updateScore() {
	"use strict";
	if (userAnswer() === currentQuestion.answer) {
		score += 1;
	}
}

// Update user score and displayed question
function update() {
	"use strict";
	updateScore();
	updateQuestion();
}

window.onload = function() {
	"use strict";
	var elements = collectElements();
	var text = createText();
	insertText(text, elements);
	document.getElementById("next").onclick = update;
};
