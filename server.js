// using express
// load the express package and create our app
var express = require('express');
var app = express();

// send our index.html file to the user for the home page
app.get('/', function(req, res) {
	res.sendfile('C:/Javascript/mean-app'  + '/index.html');
});

// start the server
app.listen(1337);
console.log('1337 is the magic port');