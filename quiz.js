window.onload = function() {
  "use strict";

  function uniqueElementsFrom(arr, length) {
    var candidateIndex = Math.floor(Math.random() * arr.length);
    var sample = [];
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
    show: function(questions) {
      var score = 0;
      var tableRows = results.table(questions).rows;

      questions.forEach(function(question, index) {
        if (question.userAnswer === question.correctAnswer) {
          score += 1;
          tableRows[index].style.color = 'green';
        }
        else {
          tableRows[index].style.color = 'red';
        }
      });
      document.getElementById('finalScore').textContent = score;

      document.getElementById('quizArea').style.display = 'none';
      document.getElementById('resultsArea').style.display = 'block';
    },

    table: function(questions) {
      var bodyElt = document.getElementById('results-body');
      var rowElt;
      var cellElt0;
      var cellElt1;
      var cellElt2;

      questions.forEach(function(question) {
        rowElt = document.createElement("tr");
        cellElt0 = document.createElement("td");
        cellElt1 = document.createElement("td");
        cellElt2 = document.createElement("td");

        cellElt0.textContent = question.name;
        cellElt1.textContent = question.correctAnswer;
        cellElt2.textContent = question.userAnswer;

        rowElt.appendChild(cellElt0);
        rowElt.appendChild(cellElt1);
        rowElt.appendChild(cellElt2);
        rowElt.classList.add('table-row');

        bodyElt.appendChild(rowElt);
      });
      return bodyElt;
    }
  };
    
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

    clone: function(obj, n, all) {
      var howManyOptions = 5;
      var answerIndex = Math.floor(Math.random() * howManyOptions);
      var newQuestion = Object.create(this);
      newQuestion.number = n;
      newQuestion.name = obj.name;
      newQuestion.correctAnswer = obj.capital;

      function toCapital(country) {
        return country.capital;
      }

      do {
        newQuestion.options = uniqueElementsFrom(all, howManyOptions - 1).map(toCapital);
      }
      while (newQuestion.options.indexOf(newQuestion.correctAnswer) !== -1);
      console.log(newQuestion.correctAnswer);
      newQuestion.options.splice(answerIndex, 0, newQuestion.correctAnswer);

      return newQuestion;
    },

    render : function() {
      function clearWarning() {
          document.getElementById("warning").textContent = '';
      }
      var optionElts = document.getElementsByClassName('options');
      document.getElementById("country").textContent = this.name;
      document.getElementById("questionNumber").textContent = this.number + ". ";

      for (var i = 0, len = optionElts.length; i < len; ++i) {
        optionElts[i].textContent = this.options[i];
        optionElts[i].previousElementSibling.checked=false;
        optionElts[i].addEventListener('click',  clearWarning);
      }
    },
  };

  function parseJSONResponse(responseText) {
    var howManyQuestions = 5;
    var howManyOptions = 5;
    var region;
    var questionNumber = 1;
    var allCountries = JSON.parse(responseText);
    if (region) {
      allCountries = allCountries.filter(function(country) {
        return country.region === region;
      });
    }
    var countries = uniqueElementsFrom(allCountries, howManyQuestions);

    var questions = countries.map(function(country, i) {
      return question.clone(country, i + 1, allCountries);
    });

    questions[questionNumber - 1].render();
    document.getElementById("next").addEventListener('click', function() {
      questions[questionNumber - 1].setUserAnswer();
      if (questionNumber < howManyQuestions && questions[questionNumber - 1].userAnswer !== '') {
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
  }

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
