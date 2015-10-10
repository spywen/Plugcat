angular.module('plugcat.dataService.authService', [
	'restangular'
]).factory('authService', function(Restangular){
	function baseAuth(){
        return Restangular.one("auth");
    }

    return {
    	getConnectedUser: getConnectedUser
    };

    function getConnectedUser() {
        return baseAuth().get();
    }
});