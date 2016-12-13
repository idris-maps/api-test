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
		+ '<p class="title">' + d.translates.name + '</p>'
		//+ '<p class="desc">' + d.translates.description + '</p>'
	+ '</div>'
+ '</a>'
}
