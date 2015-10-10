angular.module('plugcat.room', [
	'plugcat.socket',
	'cfp.hotkeys',
	'plugcat.favico',
	'plugcat.presence',
	'plugcat.authManager',
	'plugcat.dataService.colorsService'
])
.config(function ($routeProvider){
    $routeProvider.when("/room/:name",{
    	title: 'Loading - Plugcat',
        controller: 'roomCtrl',
        templateUrl: "room.html"
    });
})
.controller('roomCtrl', function($scope, $rootScope, $routeParams, socket, hotkeys, favico, presence, authManager, colorsService){
	$scope.newMessageContent = '';
	$rootScope.title = $routeParams.name + ' - Plugcat';
	$scope.room = {
		name: $routeParams.name,
		messages: []
	};
	$scope.count = 0;
	$scope.currentUser = authManager.getUserConnected();
	$scope.settings = {};

	$scope.loadRoom = function(){
		//Join room
		socket.emit("joinRoom", $routeParams.name);

		//Get colors
		colorsService.findAll().then(function(colors){
			$scope.settings = {colors: colors};
		}, function(){
			plugtoast.error($translate.instant('GENERIC_ERROR'));
		});
	};

	$scope.sendMessage = function(){
		if($scope.newMessageContent.length !== 0){
			var newMessage = {
				room: $routeParams.name,
				content: $scope.newMessageContent,
				date: undefined,
				owner:'me',
				anonym: _.isUndefined($scope.currentUser),
				userId: _.isUndefined($scope.currentUser) ? 0 : $scope.currentUser._id,
				background: $scope.currentUser ? $scope.currentUser.color : "#CBEACB"
			};
			$scope.room.messages.push(newMessage);
			$scope.newMessageContent = '';
			socket.emit("messageOut", newMessage);
		}
	};

	socket.on("messageIn", function(data){
		//For anonymous change default color
		if(data.anonym){
			data.background = "#CBE0EA";
		}

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
}).directive('keepScrollBot', function () {
  return {
    scope: {
      keepScrollBot: "="
    },
    link: function ($scope, $element) {
      $scope.$watchCollection('keepScrollBot', function (newValue) {
        if (newValue)
        {
          	$element[0].scrollTop = $element[0].scrollHeight;
        }
      });
    }
  };
});