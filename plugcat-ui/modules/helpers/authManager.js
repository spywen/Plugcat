angular.module('plugcat.authManager', [
	'plugcat.dataService.authService'
])
.factory('authManager', function(authService){
	return {
		getUserConnected: getUserConnected,
		refreshUserConnected: refreshUserConnected
	};

	/*
		Get user connected inside global local variable
	*/
	function getUserConnected(){
		return window.user;
	}

	/*
		request server to get up to date user profile and reasigned window.user
	*/
	function refreshUserConnected(){
		authService.getConnectedUser().then(function(profile){
			console.log(profile);
			window.user = profile;
		});
	}
});