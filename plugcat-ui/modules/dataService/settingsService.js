angular.module('plugcat.dataService.settingsService', [
	'restangular'
]).factory('settingsService', function(Restangular){
	function baseAuth(){
        return Restangular.one("settings");
    }

    return {
    	save: save
    };

    function save(settings) {
        return baseAuth().post("", settings);
    }
});