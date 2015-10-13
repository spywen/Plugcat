angular.module('plugcat.room', [
	'cfp.hotkeys',
	'pascalprecht.translate',
	'plugcat.favico',
	'plugcat.presence',
	'plugcat.authManager',
	'plugcat.dataService.colorsService',
	'plugcat.dataService.authService'
])
.config(function ($routeProvider){
    $routeProvider.when("/room/:name",{
    	title: 'Loading - Plugcat',
    	from:"room",
        controller: 'roomCtrl',
        templateUrl: "room.html",
        resolve:{
        	token: function(authService){
        		return authService.getToken();
        	}
        }
    });
})
.controller('roomCtrl', function($scope, $translate, $rootScope, $routeParams, plugsocket, hotkeys, favico, presence, authManager, colorsService, token){
	
	//Set page title :
	$rootScope.title = $routeParams.name + ' - Plugcat';

	//Room
	$scope.room = {
		name: $routeParams.name,
		messages: []
	};
	$scope.users = [];

	//Message
	$scope.newMessageContent = '';
	$scope.count = 0;


	$scope.currentUser = authManager.getUserConnected();
	$scope.settings = {};


	//Load room
	$scope.loadRoom = function(){
		//Join room
		plugsocket.emit("joinRoom", {roomName: $routeParams.name, token: token});

		//Get colors
		colorsService.findAll().then(function(colors){
			$scope.settings = {colors: colors};
		}, function(){
			plugtoast.error($translate.instant('GENERIC_ERROR'));
		});
	};

	//Message to send
	$scope.sendMessage = function(){
		if($scope.newMessageContent.length !== 0){
			var newMessage = {
				room: $routeParams.name,
				content: $scope.newMessageContent
			};
			//$scope.room.messages.push(newMessage);
			$scope.newMessageContent = '';
			plugsocket.emit("messageOut", newMessage);
		}
	};

	//Message received
	plugsocket.on("messageIn", function(message){
		message.iAmOwner = false;

		$scope.room.messages.push(message);
		//Play sound
		var audio = new Audio('/static/sounds/alert1.mp3');
		audio.play();

		//Add notification
		$scope.count++;
		favico.badge($scope.count);
    });

    //Message sended by the user himself
    plugsocket.on("messageSended", function(message){
    	message.iAmOwner = true;
		$scope.room.messages.push(message);
    });

    //Get room info
    plugsocket.on("roomInfo", function(room){
    	$scope.users = room.users;
    });

	//User joined the room
    plugsocket.on("userJoined", function(data){
    	$scope.users = data.room.users;
    	var info = {
    		type:'info',
    		event:'join',
    		publicName: data.profile.publicName
    	};
    	$scope.room.messages.push(info);
    });

    //User left the room
    plugsocket.on("userLeft", function(data){
    	$scope.users = data.room.users;
    	var info = {
    		type:'info',
    		event:'leave',
    		publicName: data.profile.publicName
    	};
    	$scope.room.messages.push(info);
    });

    



    presence.onChange(function(state) {
    	$scope.count = 0;
	    favico.reset();
	});

    hotkeys.add({
		combo: 'enter',
		allowIn: ['INPUT', 'TEXTAREA'],
		callback: function() {
			$scope.sendMessage();
			event.preventDefault();
		}
	});

	document.onkeydown = function(e) {
	  	document.querySelector(".messageInput").focus();
	};

}).directive('keepScrollBot', function ($timeout) {
  return {
    scope: {
      keepScrollBot: "="
    },
    link: function ($scope, $element) {
      $scope.$watchCollection('keepScrollBot', function (newValue) {
        if (newValue)
        {
        	$timeout(function(){
        		$element[0].scrollTop = $element[0].scrollHeight;
        	}, 0);
        }
      });
    }
  };
});