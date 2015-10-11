angular.module('plugcat.dataService.authService', [
	'restangular'
]).factory('authService', function(Restangular){
	function baseAuth(){
        return Restangular.one("auth");
    }

    return {
    	getConnectedUser: getConnectedUser,
        getToken: getToken
    };

    function getConnectedUser() {
        return baseAuth().get();
    }

    function getToken() {
        return baseAuth().one('token').get();
    }
});