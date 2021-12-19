'use strict'

var config = require('./config');
var codes = require('./consts/Codes');

// constants
var API_NAME = config.API_NAME;
var PORT = config.API_PORT;

// libs
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');

// web settings
var app = express();
var compression = require('compression');
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(flash());

// Use EJS(Embedded JavaScript templates)
var ejs = require('ejs');
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.engine('html', ejs.renderFile);

// Passport Setting for SNS Login
/*
var passport = require('passport');
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));
app.use(passport.initialize());
// app.use(passport.session());
*/

// headers
app.use(function(req, res, next) {
	req.context = {
		appid: req.header('app-client-id'),
		token: req.header('authorization'),
		referer: req.headers.referer
	};

	res.header("Server", "Auoi");
	res.header("X-Powered-By", "Auoi");

	res.header("X-Frame-Options", "SAMEORIGIN");
	res.header("X-XSS-Protection" , "1; mode=block");
	res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

	// cros
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Credentials", false);
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type, Origin, Authorization, Accept, Client-Security-Token, Accept-Encoding");

	next();
});

// api routes
app.use('/v1.0/', require('./routes/apis/auoi/v1.0/Controller.js'));
app.use('/', require('./routes/root/Controller.js'));

// not found
app.use(function(req, res, next) {
	res.status(404);

	res.json({'success': false, 'code': codes.NOT_FOUND, 'message': 'not found'});

	next();
});

// internal server error
app.use(function(err, req, res, next) {
	res.status(err.status || 500);

	res.json({'success': false, 'code': codes.UNKNOWN_ERROR, 'message': 'undefined error'});
});

// start server
app.listen(PORT, function() {
	console.log(new Date(), "API." + API_NAME, 'Start API Server, Listen ' + PORT);
});
