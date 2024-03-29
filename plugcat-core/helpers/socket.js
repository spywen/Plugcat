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
	- messageIn : message sended to a room
*/
module.exports = exports = function(db, io) {

	var colorRepository = new ColorRepository(db);

	var rooms = {};

	io.sockets.on('connection', function (socket) {

		//DISCONNECTION
		socket.on('disconnect', function(){
			disconnect(socket);
		});

		socket.on('forceDisconnection', function(){
			disconnect(socket);
		});

		//WEB RTC TRANSFER MSG
		socket.on('msg', function(data){
			logger.debug('MSG');
			socket.broadcast.to(socket.room).emit('msg', data);
		});

		//JOINED
	    socket.on('joinRoom', function (data, callback) {
	    	socket.room = data.roomName;
	    	var token = data.token;
	    	logger.debug(token);

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
		    				background:_.result(_.findWhere(colors, {'default':true}), 'background'),
		    				foreground:_.result(_.findWhere(colors, {'default':true}), 'foreground'),
		    				avatar:'/static/img/plugcat_anonym_50_Teal.png'
		    			};
		    		}
		    	});

		    	logger.debug("Connection (anonym: "+ socket.profile.anonym +") to the room : " + socket.room);

		        if(rooms[socket.room] != undefined){//Add user profile to the room if already exists
		            rooms[socket.room].users.push(socket.profile);
		        }else{//Create room
		            rooms[socket.room] = {name: socket.room, users:[socket.profile]};
		        }

		        socket.join(socket.room);
	            socket.broadcast.to(socket.room).emit('userEvent', {type: "join", profile: socket.profile, room: rooms[socket.room]});
	            callback(rooms[socket.room]);
			});

	    	
	    });

		//MESSAGE SEND
	    socket.on('messageOut', function (message, callback) {
	    	message.owner = socket.profile;
	    	message.date = { 
	    		hour: moment().format("HH:mm"),
	    		day: moment().format("DD/MM/YYYY")
	    	};
	        //Send message to all the participants
	        socket.broadcast.to(socket.room).emit('messageIn', message);
	        //Send the same message to the owner to confirm that the message is sended
	        callback(message);
	    });

	});

	function disconnect(socket){
		if(!_.isUndefined(rooms[socket.room])){
			logger.debug("Disconnection (anonym: "+ socket.profile.anonym +") from the room : " + socket.room);

			//Remove user from the room
			_.pull(rooms[socket.room].users, socket.profile);
			//Inform room
			socket.broadcast.to(socket.room).emit('userEvent', {type:"leave", profile: socket.profile, room: rooms[socket.room]});
			//Leave properly the room
	        socket.leave(socket.room);
		}
	}
};