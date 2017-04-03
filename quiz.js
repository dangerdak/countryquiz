window.onload = function() {
  "use strict";

  function randomElementFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  var results = {
    userAnswers: [],
    score: 0,
    
    // Insert results
    show: function() {
      // Update getUserAnswers with final answer
      results.userAnswers.push(question.userAnswer);
      // Insert answer table
      // Calculate score
      var tableRows = results.table(quiz.howManyQuestions).childNodes;
      for (var i = 0; i < quiz.howManyQuestions; ++i) {
        if (results.userAnswers[i] === quiz.answers[i]) {
          results.score += 1;
          // Color-code table
          tableRows[i].style.color = "green";
        } else {
          tableRows[i].style.color = "red";
        }
      }
      document.getElementById("finalScore").textContent = results.score;
      // Display results
      document.getElementById("quizArea").style.display = "none";
      document.getElementById("resultsArea").style.display = "block";
    },

    table: function(howManyQuestions) {
      var tableElt = document.createElement("table");
      var headElt = tableElt.createTHead();
      var headCell0 = document.createElement("th");
      var headCell1= document.createElement("th");
      var headCell2= document.createElement("th");
      var bodyElt = tableElt.createTBody();
      var rowElt;
      var cellElt0;
      var cellElt1;
      var cellElt2;
      
      headCell0.textContent = "Country";
      headCell1.textContent = "Capital";
      headCell2.textContent = "Your Answer";
      headElt.appendChild(headCell0);
      headElt.appendChild(headCell1);
      headElt.appendChild(headCell2);

      for (var i = 0; i < howManyQuestions; ++i) {
        rowElt = document.createElement("tr");
        cellElt0 = document.createElement("td");
        cellElt1 = document.createElement("td");
        cellElt2 = document.createElement("td");

        cellElt0.textContent = quiz.questions[i].country;
        cellElt1.textContent = quiz.questions[i].options[quiz.answers[i]];
        cellElt2.textContent = quiz.questions[i].options[results.userAnswers[i]];

        rowElt.appendChild(cellElt0);
        rowElt.appendChild(cellElt1);
        rowElt.appendChild(cellElt2);
        rowElt.classList.add('table-row');
        bodyElt.appendChild(rowElt);
        tableElt.classList.add('table');
      }
      document.getElementById("resultsArea").appendChild(tableElt);
      return bodyElt;
    }
  };
    
  // Information for updating question
  var question = {
    number: 0,

    name : '',

    correctAnswer: '',

    userAnswer: '',

    options: [],

    setUserAnswer: function() {
      var buttons = document.getElementsByClassName("optionButtons");
      for (var i = 0; i < buttons.length; ++i) {
        if (buttons[i].checked) {
          this.userAnswer = i;
        }
      }
    },

    clone: function(obj, n, all, howManyOptions) {
      var newQuestion = Object.create(this);
      howManyOptions = howManyOptions || 5;
      newQuestion.number = n;
      newQuestion.name = obj.name;
      newQuestion.correctAnswer = obj.capital;
      newQuestion.options.push(obj.capital);

      for (var i = 0; i < howManyOptions - 1; ++i) {
        newQuestion.options.push(randomElementFrom(all).capital);
      }

      return newQuestion;
    },

    render : function() {
      var optionsElt;
      document.getElementById("country").textContent = this.name;
      document.getElementById("questionNumber").textContent = this.number + ". ";

      // Display options
      for (var i = 0, len = quiz.howManyOptions; i < len; ++i) {
        optionsElt = document.getElementsByClassName("options")[i];
        optionsElt.textContent = this.options[i];
        // Uncheck radio button
        optionsElt.previousElementSibling.checked=false;
      }
    },

    update: function() {
      var optionsElt;
      var buttonElt;
      document.getElementById("country").textContent = quiz.questions[question.number].country;
      if (question.number !== 0) {
        results.userAnswers.push(question.userAnswer);
      }
      for (var i = 0, len = quiz.howManyOptions; i < len; ++i) {
        optionsElt = document.getElementsByClassName("options")[i];
        optionsElt.textContent = quiz.questions[question.number].options[i];
        // Uncheck radio button
        optionsElt.previousElementSibling.checked=false;
      }
      // Displays question number after incrementing it
      // (As it should be one greater than the index)
      document.getElementById("questionNumber").textContent = this.number + ". ";
      if (question.finalQuestion()) {
        buttonElt = document.getElementById("next");
        buttonElt.value = "Results";
        buttonElt.onclick = results.show;
      }
    },

    // Returns true if question is the last
    finalQuestion: function() {
      if (question.number === quiz.howManyQuestions) {
        return true;
      } else {
      return false;
      }
    },

    // Can't use "this" keyword as method will be invoked on an event handler
    // (The event object will then become "this")
    next: function() {
      var warningElt = document.getElementById("warning");
      // Clear warning
      warningElt.textContent = "";
      // Only update question if an answer had been chosen
      // (Except for initial insertion of question)
      console.log(typeof this.setUserAnswer);
      this.setUserAnswer();
      if (this.userAnswer !== '' || this.number === 1) {
        this.render();
      } else {
        warningElt.textContent = "Please select an answer before continuing!";
      }
    }

  };

  // Generate all quiz questions using response to ajax request
  var quiz = {
    howManyQuestions: 5,
    howManyOptions: 5,

    answers: [],
    questions: [],
    currentQuestion: 0,

    // Check if capital property is present
    capital: function(country) {
      if (country.capital.length > 1) {
        return true;
      } else {
        return false;
      }
    },

    setRegion: function(allCountries, continent) {
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
    },

    // Check for duplicate options
    isDuplicate: function(candidate, options, answer) {
      // Candidate will become a duplicate if it equals the answer
      if (candidate === answer) {
        return true;
      }
      // Can't be duplicate if there are no options yet
      // Must do this before trying to index options below
      if (options.length === 0) {
        return false;
      }
      // Check for duplicates in options so far
      for (var i = 0; i < options.length; ++i) {
        if (candidate === options[i]) {
          return true;
        }
      }
      return false;
    },


    // !!Should insert entire element so number of options is variable
    insertHTML: function() {
      var selectionArea = document.getElementById("selectionArea");
      for (var i = 0; i < quiz.howManyOptions; ++i) {
        var optionDiv = document.createElement("div");
        var inputElt = document.createElement("input");
        var labelElt = document.createElement("label");
        var lineElt = document.createElement("br");

        optionDiv.className = "option-container";
        inputElt.type = "radio";
        inputElt.name = "city";
        inputElt.className = "optionButtons";
        inputElt.id = "option" + i;
        labelElt.className = "options";
        labelElt.htmlFor = "option" + i;
        labelElt.addEventListener('click', function() {
          var warningElt = document.getElementById("warning");
          warningElt.textContent = "";
        });

        optionDiv.appendChild(inputElt);
        optionDiv.appendChild(labelElt);
        selectionArea.appendChild(optionDiv);
      }
    },

    generate: function(allCountries) {
      // Possible regions:
      var allRegions = ["Africa", "Americas", "Asia", "Europe", "Oceania"];

      var countryToUse;
      var countryIndex;
      var answerIndex;
      var randomCountry;

      var countries = quiz.setRegion(allCountries);
      var totalCountries = countries.length;

      for (var i = 0; i < this.howManyQuestions; ++i) {
        // Each array element will contain an object with info about a country
        quiz.questions[i] = {};
        quiz.questions[i].options = [];
        // Generate random indices to decide locations of answers within options
        answerIndex = Math.floor(Math.random() * quiz.howManyOptions);
        // Remember indices of the correct answers
        quiz.answers.push(answerIndex);

        // Generate random index to select country from JSON file
        // Ensure capital property exists on this country
        do {
          countryIndex =  Math.floor(Math.random() * totalCountries);
          countryToUse = countries[countryIndex];
        }
        while (!quiz.capital(countryToUse));

        // Set questions based on randomly chosen countries
        quiz.questions[i].country = countryToUse.name;

        // Generate random options (capital cities)
        // And include answer among them
          for (var j = 0; j < quiz.howManyOptions; ++j) {
            // Insert answer at chosen index
            if (j === answerIndex) {
              quiz.questions[i].options[j] = countryToUse.capital;
            } else {
              // Ensure capital property exists on this country
              // And that there are no duplicate options
              do {
              randomCountry = countries[Math.floor(Math.random() * totalCountries)];
              }
              while (!quiz.capital(randomCountry) || quiz.isDuplicate(randomCountry.capital, quiz.questions[i].options, countryToUse.capital)); 
              quiz.questions[i].options[j] = randomCountry.capital;
            }
          }
      }
    }
  };

  function parseJSONResponse(responseText) {
    var allCountries = JSON.parse(responseText);
    var q1 = question.clone(allCountries[0], 1, allCountries);
    quiz.insertHTML();
    q1.next();
    document.getElementById("next").addEventListener('click', function() {
      q1.next();
    });
    /*
    quiz.generate(allCountries);
    */
  }

  // AJAX request for country data in file at url
  function fetchData(url, responseHandler) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.setRequestHeader("Content-type", "application/json");
    request.onreadystatechange = function() {
      if (request.readyState === 4 && request.status === 200) {
        responseHandler(request.responseText);
      }
    };
    request.send();
  }


  fetchData('countries.json', parseJSONResponse);
};
