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
