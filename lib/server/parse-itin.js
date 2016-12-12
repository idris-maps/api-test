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
			desc: d.translates.description
		},
		geometry: {
			type: 'LineString',
			geometry: d.path
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
