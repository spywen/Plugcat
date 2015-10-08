angular.module('plugcat.authManager', [])
.factory('authManager', function(){
	return {
		getUserConnected: getUserConnected
	};

	function getUserConnected(){
		return window.user;
	}
});