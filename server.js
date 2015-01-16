
// Using just node.js
// get the http and filesystem modules
var http = require('http');
	fs = require('fs');

// create our server using the http module
http.createServer(function(req, res) {

	// write to our server. set configuration for the response
	res.writeHead(200, {
		'Content-Type': 'text/html',
		'Access-Control-Allow-Origin' : '*'
	});

	// grab the index html file using fs
	var readStream = fs.createReadStream('C:/Javascript/mean-app' + '/index.html');

	// send the html file to our user
	readStream.pipe(res);
}).listen(1337);

// tell ourselves what's happening
console.log("Visit me at http://localhost:1337");