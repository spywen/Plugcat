//------ MODULES ------
var CONFIGS = require('./configs.js'),
    http = require('http'), 
    path = require('path'),
    io = require('socket.io'),
    express = require('express'),
    app = express(),
    server = http.createServer(app).listen(8080, function(){
        var host = server.address().address;
        var port = server.address().port;

        console.log('Example app listening at http://%s:%s', host, port);
    }),
    io = require('socket.io').listen(server);

//------ CONSTANTS ------
const PORT=CONFIGS.port;

//------ CONFIGS ------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//------ PAGE ROUTING ------
var index = require('./routes/index'),
    error = require('./routes/error'),
    logger = require('./helpers/logger');

var logAccess = function(req, res, next){
    logger.debug('Access to : ' + req.url);
    next();
};

//------ STATIC ROUTING ------
app.use('/static', express.static('dist'));//1: fake path, 2) real path

app
    .get('/', [logAccess], index.get)
    .get('/room/*', [logAccess], index.get)
    .use(error.unknownPage)
    .use(error.serverError);

//------ SOCKET ------
var rooms = [];

io.sockets.on('connection', function (socket) {

    socket.on('messageOut', function (message) {
        message.owner = 'other';
        socket.broadcast.emit('messageIn', message);
    });

});
