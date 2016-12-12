var request = require('request')
var dev = require('../../config.json').dev
var testData = require('../test-data/itins.json')

module.exports = function(polygon, callback) {
	if(dev) {
		callback(null, testData)
	} else {
		var url = 'https://www.snukr.com/api-snukr-v1/itineraries?lang=fr&limit=20&orderBy=-weight,-average&page=1&polygon=' 
			+ polygon + '&type=area'
		request(url, function(error, response, body) {
			if(!error && response.statusCode === 200) {
				var data = JSON.parse(body)
				callback(null, data)
			} else {
				callback("Got an error: ", error, ", status code: ", response.statusCode)
			}
		})
	}
}

