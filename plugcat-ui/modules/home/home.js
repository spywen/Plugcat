angular.module('plugcat.home', [
	'ngRoute'
])
.config(function ($routeProvider){
    $routeProvider.when("/",{
        controller: 'homeCtrl',
        templateUrl: "home.html"
    });
})
.factory('homeVar', function(){
	return {
		roomPath: "/room/"
	};
}).controller('homeCtrl', function($scope, $location, homeVar){
	$scope.goToRoom = function(){
		$location.path(homeVar.roomPath + $scope.room.name);
	};

	document.onkeydown = function(e) {
	  	document.querySelector(".roomInput").focus();
	};
});