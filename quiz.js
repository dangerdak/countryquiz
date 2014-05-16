window.onload = function(){
"use strict";
	var countryName="Canada";
	var countryOptions = {
		"Canada": ["Toronto", "Ottowa", "Sydney", "London", "Brasil", "Accra", "Georgia", "Alberta"]};
	quiz.injectCountry(countryName);
	quiz.injectOptions(countryOptions[countryName], 4);
};

var quiz = {
	//Insert the name of the country which the question is about
	injectCountry: function(countryName) {
		"use strict";
		var element = document.getElementById("country");
		var country = document.createTextNode(countryName);
		element.appendChild(country);
	},
	//Insert the options available for a given country
	injectOptions: function(listOptions, numberOfOptions) {
		"use strict";
		var elements = document.getElementsByClassName("options");
		for(var i=0; i<numberOfOptions; i++) {
			var option = document.createTextNode(listOptions[i]);
			elements[i].appendChild(option);
		}
	}
};
