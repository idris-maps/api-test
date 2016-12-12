var cityPoly = require('./get-city-polygon')
var cityItins = require('./get-city-itins')
var parseItins = require('./parse-itins')

window.onload = function() {
	document.getElementById('btn').onclick = function() {
		getItins(document.getElementById('city').value)
	}
}

function getItins(city) {
	cityPoly(city, function(err, poly) {
		if(err) { error = err }
		cityItins(poly, function(err, itins) {
console.log(itins)
			document.getElementById('choose-itin').innerHTML = parseItins(itins)
		})
	})
}
