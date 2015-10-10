var ErrorHandler = require('./error').errorHandler
	, express = require('express')
    , RoutesHandler = require('./routesHandler')
    , Api = require('./api');

module.exports = exports = function(db, app, passport) {

    var routesHandler = new RoutesHandler(db);

	// --- Home ---
	app.get('/', routesHandler.connexionNotRequired);

	// --- Room ---
	app.get('/room/*', routesHandler.connexionNotRequired);

    // --- Settings ---
    app.get('/settings', routesHandler.connexionRequired);

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
    

    // --- API ---
    Api(db, app);
    

	app.use('/static', express.static('dist'));
	app.use(ErrorHandler);
};
