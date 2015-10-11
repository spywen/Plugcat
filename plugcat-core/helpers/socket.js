var _ = require('lodash')
	, moment = require('moment')
	, logger = require('./logger')
	, Cache = require('./cache')
	, ColorRepository = require("./../repositories/colorRepository.js");

/*
	--- List of socket messages ---

	@@@ Received :
	- joinRoom : user join the room
	- messageOut : message to send to a room
	- disconnect : user disconnected

	@@@ Send:
	- userLeft : one user left the room
	- userJoined : one user joined the room
	- roomInfo : info about a room for a just joined user
	- messageIn : message sended to a room
	- messageSended : message sended to the sender (server need to compute some values before to display it on the sender screen)
*/
module.exports = exports = function(db, io) {

	var colorRepository = new ColorRepository(db);

	var rooms = {};

	io.sockets.on('connection', function (socket) {

		//DISCONNECTION
		socket.on('disconnect', function(){

			if(!_.isUndefined(rooms[socket.room])){
				//Remove user from the room
				_.pull(rooms[socket.room].users, socket.profile);
				//Inform room
				socket.broadcast.to(socket.room).emit('userLeft', {profile: socket.profile, room: rooms[socket.room]});
				//Leave properly the room
		        socket.leave(socket.room);
			}
			
			logger.debug("User disconnected");
		});

		//JOINED
	    socket.on('joinRoom', function (data) {
	    	logger.debug("User connected");
	    	socket.room = data.roomName;
	    	var token = data.token;

			colorRepository.getColors(function(err, colors){
				//Manage user profile :
		    	Cache.get(token, function(profile){
		    		//console.log(_.findWhere(colors, {background:profile.color}));
		    		if(profile != undefined){
		    			socket.profile = {
		    				token: token,
		    				anonym:false,
		    				publicName:profile.givenName,
		    				background:profile.color,
		    				foreground:_.result(_.findWhere(colors, {background:profile.color}), 'foreground'),
		    				avatar:profile.avatar.url
		    			};
		    		}else{
		    			socket.profile = {
		    				token: token,
		    				anonym:true,
		    				publicName:'Anonym',
		    				background:'#CBEACB',
		    				foreground:'#000000',
		    				avatar:'/static/img/plugcat_anonym_50.png'
		    			};
		    		}
		    	});

		        if(rooms[socket.room] != undefined){//Add user profile to the room if already exists
		            socket.join(socket.room);
		            rooms[socket.room].users.push(socket.profile);
		            socket.broadcast.to(socket.room).emit('userJoined', {profile: socket.profile, room: rooms[socket.room]});
		        	socket.emit('roomInfo', rooms[socket.room]);
		        }else{//Create room
		            rooms[socket.room] = {name: socket.room, users:[socket.profile]};
		            socket.join(socket.room);
		            socket.broadcast.to(socket.room).emit('userJoined', {profile: socket.profile, room: rooms[socket.room]});
		            socket.emit('roomInfo', rooms[socket.room]);
		        }
			});

	    	
	    });

		//MESSAGE SEND
	    socket.on('messageOut', function (message) {
	    	message.owner = socket.profile;
	    	message.date = { 
	    		hour: moment().format("HH:mm"),
	    		day: moment().format("DD/MM/YYYY")
	    	};
	        //Send message to all the participants
	        socket.broadcast.to(socket.room).emit('messageIn', message);
	        //Send the same message to the owner to confirm that the message is sended
	        socket.emit('messageSended', message);
	    });

	});
};