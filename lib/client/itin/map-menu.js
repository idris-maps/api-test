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
