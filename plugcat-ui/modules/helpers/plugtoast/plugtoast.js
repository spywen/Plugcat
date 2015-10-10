angular.module('plugcat.plugtoast', [
	'ngMaterial'
])
.factory('plugtoast', function($mdToast){

	return {
		error: error,
		success:success,
		info:info
	};

	function error(message, delay){
		showToast('error', message, delay);
	}

	function success(message, delay){
		showToast('success', message, delay);
	}

	function info(message, delay){
		showToast('info', message, delay);
	}

	function showToast(type, message, delay){
		$mdToast.show({
			controller: 'ToastCtrl',
			templateUrl: 'plugtoast.tpl.html',
			hideDelay: (_.isNumber(delay)) ? delay : 3000,
			position: 'bottom right',
			locals:{
				message: message,
				type:type
			}
		});
	}

}).controller('ToastCtrl', function($scope, $mdToast, message, type){

	$scope.message = message;
	$scope.type = type;

	$scope.closeToast = function() {
		$mdToast.hide();
	};
});