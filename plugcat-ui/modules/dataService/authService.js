angular.module('plugcat.dataService.authService', [
	'restangular'
]).factory('authService', function(Restangular){
	function baseAuth(){
        return Restangular.one("auth");
    }

    return {
    	loggedin: loggedin
    };

    function loggedin() {
        return baseAuth().one('loggedin').get();
    }
});