var data = require('./itins.json')

console.log(itinHTML(data[0]))


function itinHTML(d) {
	return '<a href="/itin#' + d.id + '">'
	+ '<div class="itin-item">'
		+ '<img src="http://' + d.picture.cdnPath + '/' + d.picture.keys[3] + '">'
		+ '<div class="over">'
			+ '<h2 class="title">' + d.translates.name + '</h2>'
			+ '<p class="desc">' + d.translates.description + '</p>'
		+ '</div>'
	+ '</div>'
+ '</a>'
}
