'use strict'

var config = require('./config');

// constants
var API_NAME = config.API_NAME;
var PORT = config.STATIC_NAME;

// libs
var express = require('express');
var flash = require('connect-flash');

// web settings
var app = express();
var compression = require('compression');
app.use(compression());
app.use(flash());

// headers
app.use(function(req, res, next) {
	console.log(new Date(), "Requested:" + req.path);

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

// static routes
app.use('/', express.static(__dirname + '/static'));

// not found
app.use(function(req, res, next) {
	var err = new Error();
	err.status = 404;
	next(err);
});

// internal server error
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.writeHead(err.status || 500);
	res.end();
});

// start server
app.listen(PORT, function() {
	console.log(new Date(), "Static." + API_NAME, 'Start Static Server, Listen ' + PORT);
});
