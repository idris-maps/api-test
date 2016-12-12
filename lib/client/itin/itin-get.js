var get = require('../utils/getJSON')
var itinParse = require('./itin-parse')

module.exports = function(id, callback) {
	var url = 'http://localhost:3000/api/itin/' + id
	get(url, function(err,data) {
		console.log(url, err, data)
		callback(err, itinParse(data))
	})
}
