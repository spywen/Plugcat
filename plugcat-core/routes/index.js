var logger = require('./../helpers/logger')
	, ErrorHandler = require('./error').errorHandler
	, express = require('express')
    , RoutesHandler = require('./routesHandler');

module.exports = exports = function(db, app, passport) {

    var routesHandler = new RoutesHandler(db);

	// --- Home ---
	app.get('/', routesHandler.returnIndexAndConnectedUserProfile);

	// --- Room ---
	app.get('/room/*', routesHandler.returnIndexAndConnectedUserProfile);

	// --- Authentication ---
    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));
    app.get('/auth/google/callback',// the callback after google has authenticated the user
        passport.authenticate('google', {
            successRedirect : '/',
            failureRedirect : '/'
        })
    );
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    
/*
    app.get('/api/auth/loggedin', function(req, res) {
    	if(req.isAuthenticated()){
    		console.dir(req.user._json);
    		res.send(req.user._json);
    	}else{
    		res.send(401);
    	}
	});
*/

	app.use('/static', express.static('dist'));
	app.use(ErrorHandler);
};
