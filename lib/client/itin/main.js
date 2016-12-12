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


