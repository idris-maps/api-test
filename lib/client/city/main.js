var cityPoly = require('./get-city-polygon')
var cityItins = require('./get-city-itins')
var parseItins = require('./parse-itins')

window.onload = function() {
	document.getElementById('btn').onclick = function() {
		getItins(document.getElementById('city').value, function(itins) {
			document.getElementById('choose-itin').innerHTML = parseItins(itins)
		})
	}
}

function getItins(city, callback) {
	cityPoly(city, function(err0, poly) {
		if(err0) { console.log('Error getting OSM polygon', err0); callback([]) }
		else if(poly === undefined) { callback([]) } 
		else {
			cityItins(poly, function(err1, data) {
				if(err1) { console.log('Error getting Snukr itineraries', err1); callback([]) }
				else { callback(data) }
			})
		} 
	})
}
