angular.module('plugcat.logo', [

]).controller('logoCtrl', function($scope, $timeout){
	$scope.animation='';
	$scope.color='blue';

	$scope.shake=function(){
		$scope.color = getRandomColor();
		$scope.animation='animated shake';
		$timeout(function(){
			$scope.animation='';
		},500,true);
    };

    function getRandomColor() {
	   var letters = '0123456789ABCDEF'.split('');
	   var color = '#';
	   for (var i = 0; i < 6; i++ ) {
	       color += letters[Math.floor(Math.random() * 16)];
	   }
	   return color;
	}

}).directive('logo', function(){
	return {
		templateUrl: 'logo.html',
		controller: 'logoCtrl',
		restrict: 'E'
	};
});