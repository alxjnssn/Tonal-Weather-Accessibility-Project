
//Input weather underground into web audio api
//Generate tone.

var twapApp = {};

twapApp.apiKey = '196aba02ee15cc36';
twapApp.apiUrl = 'http://api.wunderground.com/api/';
//Get weather data from weather underground

twapApp.getWeather = function(country, city) {
	$.ajax({
		url: twapApp.apiUrl + twapApp.apiKey + "/geolookup/conditions/q/" + country + "/" + city + ".json",
		method: 'GET',
		dataType: 'jsonp'
	}).then(function(weatherStats){
		twapApp.generateTone(weatherStats);
	});
};

twapApp.generateTone = function(weatherStats){
	// console.log(weatherStats)
	var wind = (weatherStats['current_observation'].wind_kph)
	var feelsLike = parseInt((weatherStats['current_observation'].feelslike_c))
	console.log(wind)
	console.log(feelsLike)
	var environment = flock.init();

	environment.start();

	var synth = flock.synth({
	    synthDef: {
	        ugen: "flock.ugen.sinOsc",
	        freq: (feelsLike * 50),
	        mul: {
            	ugen: "flock.ugen.asr",
            	start: 0.0,
            	attack: 0.8,
            	sustain: 0.25,
            	release: 1.0,
	            gate: {
	                ugen: "flock.ugen.impulse",
	                rate: "control",
	                freq: 0.75,
	                phase: 1.0
	            }
        	},
	        add: {
        		ugen: "flock.ugen.pinkNoise",
        		mul: (wind / 20)
   			}
	    }
	});
	setTimeout(environment.stop, 4000);	
};

twapApp.init = function(){

	$('#searchForm').on('submit', function(e) {
		e.preventDefault();
		var country = $('input[name=country]').val();
		var city = $('input[name=city]').val();
		console.log(country, city)
		twapApp.getWeather(country, city)
		$('input[name=country]').val('');
		$('input[name=city]').val('');
	});
};

// $('#info').click(function() {
// 	$('.landingPage').addClass('slideOutDown');
// 	$('.infoPage').addClass('slidInDown');
// });

$(function() {
	twapApp.init();
});