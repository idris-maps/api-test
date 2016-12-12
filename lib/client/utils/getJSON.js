module.exports = function(url, callback) {
	var request = new XMLHttpRequest()
	request.open('GET', url, true)
	request.onload = function() {
		if (request.status >= 200 && request.status < 400) {
			var data = JSON.parse(request.responseText)
			callback(null, data)
		} else {
			callback('Server responded with an error. Status: ' + request.status )
		}
	}
	request.onerror = function() {
		callback('Could not connect to the server')
	}
	request.send()
}

