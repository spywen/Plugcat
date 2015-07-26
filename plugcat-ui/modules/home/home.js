angular.module('plugcat.home', [
])
.config(function ($routeProvider){
    $routeProvider.when("/",{
        controller: 'homeCtrl',
        templateUrl: "home.html"
    });
})
.controller('homeCtrl', function($scope, $location){
	$scope.goToRoom = function(){
		$location.path('/room/' + $scope.room.name);
	};
});