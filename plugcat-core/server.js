//------ CONFIGS ------
const CONFIGS = require('./configs.js');
var logger = require('./helpers/logger');

//------ MODULES ------
var http = require('http'), 
    moment = require('moment'),
    path = require('path'),
    io = require('socket.io'),
    express = require('express'),
    app = express(),
    server = http.createServer(app).listen(CONFIGS.port, function(){
        var host = server.address().address;
        var port = server.address().port;

        console.log('Plugcat running at http://%s:%s', host, port);
    }),
    io = require('socket.io').listen(server),
    _ = require('lodash');


//------ VIEWS ------
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//------ PAGE ROUTING ------
var index = require('./routes/index'),
    error = require('./routes/error');

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

    socket.on('joinRoom', function (room) {
        if(_.some(rooms, room)){
            socket.join(room);
            socket.broadcast.to(room).emit('joinRoom', true);
        }else{
            rooms.push(room);
            socket.join(room);
            socket.broadcast.to(room).emit('joinRoom', true);
        }
    });

    socket.on('messageOut', function (message) {
        message.owner = 'other';
        message.hour = moment().format("HH:mm");
        message.day = moment().format("DD/MM/YYYY");
        socket.broadcast.to(message.room).emit('messageIn', message);
    });

});
