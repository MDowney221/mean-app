// BASE SETUP
// ============================

// CALL THE PACKAGES ---------------------------------------------------------------
var express = require('express'); 		// call express
var app = express(); 				// define our app using express
var bodyParser = require('body-parser'); 	// get body-parser
var morgan = require('morgan');		// used to see requests
var mongoose = require('mongoose');		// for working with our database
var port = process.env.PORT || 5000; 	// set the port of our app
var User = require('./app/models/user');
var jwt = require('jsonwebtoken');

// super secret for creating tokens
var superSecret = 'ilovescotchscotchyscotchscotch';

// APP CONFIGURATION -----------------------------------------------------------------
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods',  'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type, \Authorization');
	next();
});

// log all requests to the console
app.use(morgan('dev'));

// connect to our database (currently local)
mongoose.connect('localhost:27017/test');

// ROUTES FOR OUR API
// ==================================================================

// basic route for the home page
app.get('/', function(req, res) {
	res.send('Welcome to the home page');
});

// get an instance of the express router
var apiRouter = express.Router();

// route to authenticate a user (POST http://localhost:5000/api/authenticate)
apiRouter.post('/authenticate', function(req, res) {

	// find the user
	// select the username and password explicitly
	User.findOne({
		username: req.body.username
	}).select('name username password').exec(function(err, user) {
		if (err) throw err;

		// no user with that username was found
		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found'});
		} else if (user) {
			// check if password matches
			var validPassword = user.comparePassword(req.body.password);
			if (!validPassword) {
				res.json({ success: false, message: 'Authentication failed. Wrong password'});
			} else {
				// if user is found and password is right
				// create a token
				var token = jwt.sign({
					name: user.name,
					username: user.username
				}, superSecret, {
					expiresinMinutes: 1440 // expires in 24 hours
				});

				// return the information including token as JSON
				res.json({
					success: true,
					message: 'Enjoy your token!',
					token: token
				});
			}
		}
	});
});

// middleware to use for all requests
apiRouter.use(function(req, res, next) {
	// do logging
	console.log('Somebody just came to our app!');

	// add more to the middleware in Chapter 10
	// this is where we will authenticate users

	next(); // make sure we go to the next routes and don't stop here
});

// test route to make sure everything is working
// accessed at GET http://localhost:8080/api
apiRouter.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /users
// ----------------------------------------------------------------------------
apiRouter.route('/users')

	// create a user (accessed at POST http://localhost:5000/api/users)
	.post(function(req, res) {

		// create a new instance of the User model
		var user = new User();

		// set the users information (comes from the request)
		user.name = req.body.name;
		user.username = req.body.username;
		user.password = req.body.password;

		// save the user and check for errors
		user.save(function(err) {
			if (err) {
				// duplicate entry
				if (err.code == 11000)  {
					return res.json({ success: false, message: 'A user with that username already exists.' });
				} else {
					return res.send(err);
				}
			};
			res.json({ message: 'User created!'});
		});
	})

	// get all the users (accessed at GET http://localhost:5000/api/users)
	.get(function(req, res) {
		User.find(function(err, users) {
			if (err) {
				res.send(err);
			};
			// return the users
			res.json(users);
		});
	});

// on routes that end in /users/:user_id
// ----------------------------------------------------------------------------
apiRouter.route('/users/:user_id')

	// get the user with that id
	// (accessed at GET http://localhost:5000/users/:user_id)
	.get(function(req, res) {
		User.findById(req.params.user_id, function(err, user) {
			if (err) res.send(err);

			// return the user
			res.json(user);
		});
	})

	// update the user with this id
	// (accessed at PUT http://localhost:5000/api/users/:user_id)
	.put(function(req,res) {

		// use our user model to find the user we want
		User.findById(req.params.user_id, function(err, user) {

			if (err) res.send(err);

			// update the users info only if it's new
			if (req.body.name) user.name = req.body.name;
			if (req.body.username) user.username = req.body.username;
			if (req.body.password) user.password = req.body.password;

			// save the user
			user.save(function(err) {
				if (err) res.send(err);

				// return a message
				res.jason({ message: 'User updated!' });
			});
		});
	})

	// delete the user with this id
	// (accessed at DELETE http://localhost:5000/api/users/:user_id)
	.delete(function(req, res) {
		User.remove({
			_id: req.params.user_id
		}, function(err, user) {
			if (err) res.send(err);

			res.json({ message: 'Successfully deleted' });
		});
	});

//***********************AUTHENTICATION***********************************************************************





// REGISTER OUR ROUTES --------------------------------------------------------
// all of our routes will be prefixed with /api
app.use('/api', apiRouter);

// START THE SERVER
// ==================================================================
app.listen(port);
console.log('Magic happens on port' + port);


/*

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
*/