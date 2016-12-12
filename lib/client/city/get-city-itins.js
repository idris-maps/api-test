var getJSON = require('../utils/getJSON')

module.exports = function(poly, callback) {
 var url = createUrl(poly)
	getJSON(url, function(err, data) {
		if(err) { callback(err) }
		else { callback(null, data) }
	})
}

function createUrl(data) {
	var url = '/api/itins/'
	data.polygonpoints.forEach(function(pt, i) { 
		if(i !== 0) { url = url + ',' }
		url = url + pt[0] + ',' + pt[1]
	})
	return url
}

