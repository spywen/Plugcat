angular.module('plugcat.room', [
	'plugcat.socket',
	'cfp.hotkeys'
])
.config(function ($routeProvider){
    $routeProvider.when("/room/:name",{
        controller: 'roomCtrl',
        templateUrl: "room.html"
    });
})
.controller('roomCtrl', function($scope, $routeParams, socket, hotkeys){
	$scope.newMessageContent = '';
	$scope.room = {
		name: $routeParams.name,
		messages: []
	};

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