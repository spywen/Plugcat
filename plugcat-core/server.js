// ---- CONFIGS ----
const CONFIGS = require('./configs.js');
var logger = require('./helpers/logger');

// ---- MODULES ----
var app = require('express')()
    , path = require('path')
    , server = require('http').Server(app)
    , io = require('socket.io')(server);

// ---- LOCAL MODULES ----
var routes = require('./routes')
    , socket = require('./helpers/socket');

// ---- VIEWS ----
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---- ROUTES ----
routes(app);

// ---- SOCKETS ----
socket(io);

// ---- RUN APP ----
server.listen(CONFIGS.port);
console.log("Plugcat running on %s:%s", CONFIGS.address, CONFIGS.port);

