angular.module('plugcat.dataService.colorsService', [
	'restangular'
]).factory('colorsService', function(Restangular){
	function baseAuth(){
        return Restangular.one("colors");
    }

    return {
    	findAll: findAll
    };

    function findAll() {
        return baseAuth().get();
    }
});