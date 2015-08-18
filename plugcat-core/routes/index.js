var logger = require('./../helpers/logger'),
	ErrorHandler = require('./error').errorHandler,
	express = require('express');

module.exports = exports = function(app) {

	//Home
	app.get('/', [logAccess], function(req, res){
		return res.render('index',{});
	});

	app.get('/room/*', [logAccess], function(req, res){
		return res.render('index',{});
	});

	app.use('/static', express.static('dist'));
	app.use(ErrorHandler);

};

var logAccess = function(req, res, next){
    logger.debug('Access to : ' + req.url);
    next();
};
