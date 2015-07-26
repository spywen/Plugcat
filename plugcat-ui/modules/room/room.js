angular.module('plugcat.room', [
	'plugcat.socket'
])
.config(function ($routeProvider){
    $routeProvider.when("/room/:name",{
        controller: 'roomCtrl',
        templateUrl: "room.html"
    });
})
.controller('roomCtrl', function($scope, $routeParams, socket){
	$scope.newMessageContent = '';
	$scope.room = {
		name: $routeParams.name,
		messages: []
	};

	$scope.sendMessage = function(){
		var newMessage = {
			room: $routeParams.name,
			content: $scope.newMessageContent,
			date: undefined,
			owner:'me'
		};
		$scope.room.messages.push(newMessage);
		$scope.newMessageContent = '';
		socket.emit("messageOut", newMessage);
	};

	socket.on("messageIn", function(data){
		$scope.room.messages.push(data);
    });
});