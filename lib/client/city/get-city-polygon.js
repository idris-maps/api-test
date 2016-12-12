var getJSON = require('../utils/getJSON')

module.exports = function(city, callback) {
 var url = 'https://nominatim.openstreetmap.org/search?city=' 
		+ encodeURIComponent(city) + '&format=json&polygon=1&limit=100'
	getJSON(url, function(err, data) {
		if(err) { callback(err) }
		else { callback(null, data[0]) }
	})
}


