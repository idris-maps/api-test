(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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


},{"../utils/getJSON":5}],2:[function(require,module,exports){
var getJSON = require('../utils/getJSON')

module.exports = function(city, callback) {
 var url = 'https://nominatim.openstreetmap.org/search?city=' 
		+ encodeURIComponent(city) + '&format=json&polygon=1&limit=100'
	getJSON(url, function(err, data) {
		if(err) { callback(err) }
		else { callback(null, data[0]) }
	})
}



},{"../utils/getJSON":5}],3:[function(require,module,exports){
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

},{"./get-city-itins":1,"./get-city-polygon":2,"./parse-itins":4}],4:[function(require,module,exports){
module.exports = function(data) {
	if(data.length === 0) { return '<p>Il n\'y a pas d\'itinéraires dans cette ville</p>' }
	else {
		var html = ''
		data.forEach(function(d) {
			html = html + itinHTML(d)
		})
		return html
	}
}

function itinHTML(d) {
	return '<a href="/itin#' + d.id + '">'
	+ '<div class="itin-item">'
		+ '<img src="http://' + d.picture.cdnPath + '/' + d.picture.keys[3] + '">'
		+ '<div class="over">'
			+ '<p class="title">' + d.translates.name + '</p>'
			+ '<p class="desc">' + d.translates.description + '</p>'
		+ '</div>'
	+ '</div>'
+ '</a>'
}

},{}],5:[function(require,module,exports){
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


},{}]},{},[3]);
