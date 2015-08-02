angular.module('plugcat.home', [
	'ngRoute',
	'ngMessages'
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
}).controller('homeCtrl', function($scope, $location, homeVar, $timeout){
	$scope.goToRoom = function(){
		if($scope.room.name.length > 0){

			$location.path(homeVar.roomPath + $scope.room.name.trim());
		}
	};

	document.onkeydown = function(e) {
	  	document.querySelector(".roomInput").focus();
	};
}).directive('validroomname', function() {
	return {
		require: 'ngModel',
		link: function(scope, elm, attrs, ctrl) {
			var INTEGER_REGEXP = /^[a-z0-9#\-+=\_&]+$/i;
			ctrl.$validators.validroomname = function(modelValue, viewValue) {
				if(viewValue === undefined || viewValue.length === 0){
					return true;
				}

				if (INTEGER_REGEXP.test(viewValue.trim())) {
					return true;
				}

				return false;
			};
		}
	};
});