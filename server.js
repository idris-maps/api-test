var express = require('express')
var app = express()

app.use(express.static('public'))
app.get('/', function(req, res) {
	res.redirect('/city')
})


var getItin = require('./lib/server/get-itin')
app.get('/api/itin/:id', function(req, res) {
	var id = req.params.id
	getItin(id, function(err,data) {
		if(err) { res.send(err) }
		else { res.send(data) }
	})
})

var getPolygon = require('./lib/server/get-polygon')
app.get('/api/itins/:polygon', function(req, res) {
	var polygon = req.params.polygon
	getPolygon(polygon, function(err,data) {
		if(err) { res.send(err) }
		else { res.send(data) }
	})
})


var port = 3000
app.listen(port, function() { console.log('Listening on port ' + port) })
