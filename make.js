var pages = require('./config.json').pages
var exec = require('child_process').exec

loop(0, pages, function() {
	console.log('done')
})

function loop(i, pages, callback) {
	if(i === pages.length) { callback() }
	else {
		var page = pages[i]
		var cmd = 'browserify lib/client/' + page + '/main.js -o public/' + page + '/script.js' 
		run(cmd, function() {
			loop(i+1, pages, callback)
		})
	}
}

function run(cmd, callback) {
	console.log('COMMAND: ', cmd)
	exec(cmd, function(error, stdout, stderr) {
		 if(error) { console.log('ERROR: ', error) }
			if(stdout) { console.log('STDOUT: ', stdout) }
			if(stderr) { console.log('STDERR: ', stderr) }
			callback()
	})
}
