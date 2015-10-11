// ---- CONFIGS ----
const CONFIGS = require('./configs.js');
var logger = require('./helpers/logger');
var colors = require('colors');

// ---- MODULES ----
var express = require('express')
	, app = express()
    , path = require('path')
    , server = require('http').Server(app)
    , io = require('socket.io')(server)
    , MongoClient = require('mongodb').MongoClient;

var passport = require('passport')
	, cookieParser = require('cookie-parser')
	, bodyParser = require('body-parser')
	, session = require('express-session')
	, methodOverride = require('method-override');


// ---- LOCAL MODULES ----
var routes = require('./routes')
    , socket = require('./helpers/socket');

// MONGO CONTEXT INITIALIZATION
MongoClient.connect(CONFIGS.db.address, function(err, db) {

	if(err){//Connection failed : error message
		logger.error('!!! --> Database unreachable : %s !!!'.red, CONFIGS.db.address);
		throw err;
	}

	// ---- PASSPORT INIT (AUTHENTICATION) ----
	require('./helpers/passport')(db, passport);

	// ---- SERVER CONFIGS ----
	app.use(cookieParser()); 
	app.use(bodyParser.json());
	app.use(methodOverride());
	app.use(session({ 
		secret: CONFIGS.sessionKey,
		resave: true,
	    saveUninitialized: true
	}));
	app.use(passport.initialize());
	app.use(passport.session());
	app.set('view engine', 'ejs');
	app.set('views', path.join(__dirname, 'views'));

	// ---- ROUTES ----
	routes(db, app, passport);

	// ---- SOCKETS ----
	socket(db, io);

	// ---- RUN APP ----
	server.listen(CONFIGS.port);
	logger.info("Plugcat running on %s:%s".cyan, CONFIGS.address, CONFIGS.port);
});



