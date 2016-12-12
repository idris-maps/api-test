var request = require('request')
var dev = require('../../config.json').dev
var testData = require('../test-data/itin.json')

module.exports = function(id, callback) {
	if(dev) {
		callback(null, testData)
	} else {
		var url = 'https://www.snukr.com/api-snukr-v1/itineraries/' + id
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

