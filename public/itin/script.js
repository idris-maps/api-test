(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var get = require('../utils/getJSON')
var itinParse = require('./itin-parse')

module.exports = function(id, callback) {
	var url = 'http://localhost:3000/api/itin/' + id
	get(url, function(err,data) {
		console.log(url, err, data)
		callback(err, itinParse(data))
	})
}

},{"../utils/getJSON":7,"./itin-parse":2}],2:[function(require,module,exports){
module.exports = function(itin) {
	return {
		line: getLine(itin),
		points: getPoints(itin)
	}
}

function getLine(d) {
	return {
		type: 'Feature',
		properties: {
			creator: d.creator.firstname + ' ' + d.creator.lastname,
			duration: d.duration,
			tags: d.allTags,
			name: d.translates.name,
			desc: d.translates.description,
			distance: Math.floor(d.length/10000)/10
		},
		geometry: {
			type: 'LineString',
			coordinates: d.path
		}
	}
}

function getPoints(d) {
	var pointFeats = []
	var steps = d.steps
	steps.forEach(function(s) {
		var p = s.point
		var f = {type: 'Feature', properties: {}, geometry: {type: 'Point'}}
		f.properties.name = p.translates.name
		f.properties.desc = p.translates.description
		f.properties.img = {}
		f.properties.img.xs = p.picture.cdnPath + '/' + p.picture.keys[3]
		f.properties.img.m = p.picture.cdnPath + '/' + p.picture.keys[0]
		f.geometry.coordinates = [p.position.lnt, p.position.lat]
		pointFeats.push(f)
	})
	return pointFeats
}

},{}],3:[function(require,module,exports){
module.exports = function(map, position) {
	var o = this
	if(position) { o.position = position } else { o.position = 'topright' }
	var btn = L.Control.extend({
		options: {
		  position: 'topright'
		},
		onAdd: function(map) {
		 var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom')
			initContainerStyle(container)
			o.container = container
			return container
		}
	})
	o.map = map
	o.btn = new btn()

// VISIBILITY
	o.shown = false
	o.show = function() {
		o.map.addControl(o.btn)
		o.shown = true
	}
	o.hide = function() {
		o.map.removeControl(o.btn)
		o.shown = false
	}
	o.toggle = function() {
		if(o.shown) { o.hide() } else { o.show() }
	}

// CONTENT
	o.setCtrl = function(fn) {
		fn()
	}
	o.setHTML = function(html) {
		o.container.innerHTML = html
	}
	o.setHTMLcb = function(html, callback) {
		o.container.innerHTML = html
		callback()
	}
	o.setContent = function(html, fn, style) {
		o.show()
		o.setHTMLcb(html, function() {
			if(fn) { o.setCtrl(fn) }
			if(style) { o.setStyle(style) }
		})	
	}

	o.setStyle = function(style) {
		setContainerStyle(o.container, style)
	}
}

function setContainerStyle(container, style) {
	if(style) {
		for(k in style) {
			container.style[k] = style[k]
		}
	}
}

function initContainerStyle(container) {
	container.style.backgroundColor = 'white'    
	container.style.width = '100%'
	container.style.height = '100%'
}

},{}],4:[function(require,module,exports){
var getItin = require('./itin-get')
var renderMap = require('./render-map')

window.onload = function() {
	console.log('loaded')
	var hash = window.location.hash
	if(hash) {
		getItin(hash.split('#')[1], function(err,data) {
			console.log(err, data)
			if(err) { document.body.innerHTML = err }
			else {
				if(window.L) { renderMap('map', data) }
				else { document.body.innerHTML = 'Leaflet needs to be loaded first' }
			}
		})
	} else { document.body.innerHTML = '<p><b>No hash!!!</b></p>' }
}



},{"./itin-get":1,"./render-map":6}],5:[function(require,module,exports){
var L_Ctrl = require('./leaflet-ctrl')
 
module.exports = function(map, data) {
	var menu = new L_Ctrl(map)
	var p = data.line.properties

	function menuHTML(p) {
		var html = '<p style="width: 100%; text-align:right"><small id="close">close</small></p>' 
		+ '<h2>' + p.name + '<br/><small> by ' + p.creator + '</small></h2>'
		+ '<p>' + p.desc + '<br/><hr/>'
		+ '<p>'
			+ '<span>Distance: ' + p.distance + '</span>'
			+ '<span style="opacity:0">xxxxxxxxxxx</span>'
			+ '<span>Duration: ' + p.duration + '</span>'		
		+ '</p>'
		+ '<hr/>'
		+ '<small>'
		p.tags.forEach(function(tag) { html = html + '#' + tag + ' ' })
			+ '</small></p>'
		return html
	}

	var menuCtrl = function() {
		document.getElementById('close').onclick = function() {
			menu.setContent(iconHTML, iconCtrl, iconStyle)
		}
	}
	var menuStyle = {
		width: '200px',
		padding: '10px',
		'text-align': 'center'
	}

	var iconHTML = '<span id="open" style="font-size:2em">?</span>'
	var iconCtrl = function() {
		document.getElementById('open').onclick = function() {
			menu.setContent(menuHTML(p), menuCtrl, menuStyle)
		}
	}
	var iconStyle = {
		width: '30px',
		padding: '5px',
		'text-align': 'center'	
	}

	menu.setContent(menuHTML(p), menuCtrl, menuStyle)
}

},{"./leaflet-ctrl":3}],6:[function(require,module,exports){
var menu = require('./map-menu')

module.exports = function(divId, data) {
// MAP
	var map = L.map(divId)
// TILES
	var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	})
// LINE itineraire
	var lineLayer = L.geoJSON(data.line)
	map.fitBounds(lineLayer.getBounds())
	lineLayer.addTo(map)
	osm.addTo(map)

// POINTS
	// icon
	var icon = L.icon({
		iconUrl: 'marker.png',
		iconSize:     [30, 36], 
		iconAnchor:   [15, 36], 
		popupAnchor:  [-15, -40] 
	})
	// create layer
	var pointLayer = L.layerGroup()

	// add points to layer
	data.points.forEach(function(f, i) { 
		var c = f.geometry.coordinates
		var marker = L.marker([c[1], c[0]], { icon: icon })
		// popup HTML
		var html = '<p style="width: 250px"><b>' + f.properties.name + '</b><br/>'
			+ f.properties.desc + '</p>'
			+ '<img id="point-' + i + '-img" class="point-img" src="http://' + f.properties.img.xs + '"/>'  
		marker.bindPopup(html)
		pointLayer.addLayer(marker) 
	})
	pointLayer.addTo(map)


	// center popup on open
	map.on('popupopen', function(e) {
		var px = map.project(e.popup._latlng)
		px.y -= e.popup._container.clientHeight/2
		map.panTo(map.unproject(px),{animate: true})
	})

	menu(map, data)

}

},{"./map-menu":5}],7:[function(require,module,exports){
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


},{}]},{},[4]);
