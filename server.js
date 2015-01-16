// load the express package and create our app
var express = require('express');
var app = express();

// set the port based on environment
var port = 1337;

// send our index.html file to the user for the home page
app.get('/', function(req, res) {
	res.sendfile('C:/Javascript/mean-app'  + '/index.html');
});

app.route('/login')

	// show the form (Get http://localhost:1337/login)
	.get(function(req, res) {
		res.send('this is the login form');
	})

	//process the form (POST http://localhost:1337/login)
	.post(function(req, res) {
		console.log('processing');
		res.send('processing the login form!');
	});

// create routes for the admin section
// get an instance of the router
var adminRouter = express.Router();

// route middleware that will happen on every request
adminRouter.use(function(req, res, next) {

	// log each request to the console
	console.log(req.method, req.url);

	// continue doing what we were doing and go to the route
	next();
});

// route the middleware to validate :name
adminRouter.param('name', function(req, res, next, name) {
	// do validation on name here
	// validation
	// log something so we know it's working
	console.log('doing name validations on ' + name);

	// once validation is done save the new item in the req
	req.name = name;
	// go to the next thing
	next();
});

// route with parameters (http://locahost:1337/admin/users/:name)
adminRouter.get('/hello/:name', function(req, res) {
	res.send('hello ' + req.name + '!');
});

// admin main page. the dashboard (http://locahost:1337/admin)
adminRouter.get('/', function(req, res) {
	res.send('I am the dashboard');
});

// users page (http://locahost:1337/admin/users)
adminRouter.get('/', function(req, res) {
	res.send('I show all the user');
});

// posts page (http://locahost:1337/admin/posts)
adminRouter.get('/', function(req, res) {
	res.send('I show all the posts!');
});

// apply the routes to our application
app.use('/admin', adminRouter);

// start the server
app.listen(1337);
console.log('1337 is the magic port');