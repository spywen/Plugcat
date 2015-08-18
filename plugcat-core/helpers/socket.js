var _ = require('lodash')
	, moment = require('moment');

module.exports = exports = function(io) {
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
};