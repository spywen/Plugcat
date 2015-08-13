angular.module('plugcat.room', [
	'plugcat.socket',
	'cfp.hotkeys',
	'plugcat.favico',
	'plugcat.presence'
])
.config(function ($routeProvider){
    $routeProvider.when("/room/:name",{
    	title: 'Loading - Plugcat',
        controller: 'roomCtrl',
        templateUrl: "room.html"
    });
})
.controller('roomCtrl', function($scope, $rootScope, $routeParams, socket, hotkeys, favico, presence){
	$scope.newMessageContent = '';
	$rootScope.title = $routeParams.name + ' - Plugcat';
	$scope.room = {
		name: $routeParams.name,
		messages: []
	};
	$scope.count = 0;

	$scope.joinRoom = function(){
		socket.emit("joinRoom", $routeParams.name);
	};

	$scope.sendMessage = function(){
		if($scope.newMessageContent.length !== 0){
			var newMessage = {
				room: $routeParams.name,
				content: $scope.newMessageContent,
				date: undefined,
				owner:'me'
			};
			$scope.room.messages.push(newMessage);
			$scope.newMessageContent = '';
			socket.emit("messageOut", newMessage);
		}
	};

	socket.on("messageIn", function(data){
		$scope.room.messages.push(data);
		//Play sound
		var audio = new Audio('/static/sounds/alert1.mp3');
		audio.play();

		//Add notification
		$scope.count++;
		favico.badge($scope.count);
    });

    presence.onChange(function(state) {
    	$scope.count = 0;
	    favico.reset();
	});

    hotkeys.add({
		combo: 'enter',
		description: 'Send your message',
		allowIn: ['INPUT', 'TEXTAREA'],
		callback: function() {
			$scope.sendMessage();
			event.preventDefault();
		}
	});

	document.onkeydown = function(e) {
	  	document.querySelector(".messageInput").focus();
	};

});