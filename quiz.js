window.onload = function() {
  "use strict";

  function uniqueElementsFrom(arr, length) {
    var candidateIndex = Math.floor(Math.random() * arr.length);
    var sample = [candidateIndex];
    while (sample.length < length) {
      while (sample.indexOf(candidateIndex) !== -1) {
        candidateIndex =  Math.floor(Math.random() * arr.length);
      }
      sample.push(candidateIndex);
    }
    return sample.map(function(candidateIndex) {
      return arr[candidateIndex];
    });
  }

  var results = {
    userAnswers: [],
    score: 0,
    
    // Insert results
    show: function(questions) {
      // Update getUserAnswers with final answer
      results.userAnswers.push(questions[quiz.howManyQuestions - 1].userAnswer);
      // Insert answer table
      // Calculate score
      var tableRows = results.table(questions, quiz.howManyQuestions).childNodes;
      for (var i = 0; i < quiz.howManyQuestions; ++i) {
        if (questions[i].userAnswer === questions[i].correctAnswer) {
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

    table: function(questions, howManyQuestions) {
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

        cellElt0.textContent = questions[i].name;
        cellElt1.textContent = questions[i].correctAnswer;
        cellElt2.textContent = questions[i].userAnswer;

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
          this.userAnswer = this.options[i];
        }
      }
    },

    clone: function(obj, n, all, howManyOptions) {
      var answerIndex;
      var newQuestion = Object.create(this);
      howManyOptions = howManyOptions || 5;
      answerIndex = Math.floor(Math.random() * howManyOptions);
      newQuestion.number = n;
      newQuestion.name = obj.name;
      newQuestion.correctAnswer = obj.capital;

      newQuestion.options = uniqueElementsFrom(all, howManyOptions - 1).map(
        function(country) {
          return country.capital;
        });
      newQuestion.options.splice(answerIndex, 0, newQuestion.correctAnswer);

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
    var questionNumber = 1;
    var allCountries = JSON.parse(responseText);
    var countries = uniqueElementsFrom(allCountries, quiz.howManyQuestions);

    var questions = countries.map(function(country, i) {
      return question.clone(country, i + 1, allCountries);
    });

    quiz.insertHTML();
    questions[questionNumber - 1].render();
    document.getElementById("next").addEventListener('click', function() {
      questions[questionNumber - 1].setUserAnswer();
      if (questionNumber < quiz.howManyQuestions && questions[questionNumber - 1].userAnswer !== '') {
        questionNumber++;
        questions[questionNumber - 1].render();
      }
      else if (questions[questionNumber - 1].userAnswer === '') {
        var warningElt = document.getElementById("warning");
        warningElt.textContent = "Please select an answer before continuing!";
      }
      else {
        this.value = "Results";
        this.onclick = results.show(questions);
      }
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
