angular.module('plugcat.settings', [
	'pascalprecht.translate',
	'plugcat.dataService.settingsService',
	'plugcat.dataService.colorsService',
	'plugcat.authManager'
])
.config(function ($routeProvider){
    $routeProvider.when("/settings",{
    	title: 'Plugcat',
        controller: 'settingsCtrl',
        templateUrl: "settings.html"
    });
})
.controller('settingsCtrl',function($scope, settingsService, plugtoast, $translate, colorsService, authManager){

	$scope.settings = {
		publicName: _.isUndefined(window.user.publicName) ? window.user.givenName : window.user.publicName,
		color: _.isUndefined(window.user.color) ? {} : window.user.color
	};

	$scope.colors = [];

	$scope.submit = function(){
		settingsService.save($scope.settings).then(function(profile){
			plugtoast.success($translate.instant('SAVED'));
			//Refresh window.user
			authManager.refreshUserConnected();
		},function(){
			plugtoast.error($translate.instant('GENERIC_ERROR'));
		});
	};

	$scope.loadColors = function(){
		colorsService.findAll().then(function(colors){
			$scope.colors = colors;
		}, function(){
			plugtoast.error($translate.instant('GENERIC_ERROR'));
		});
	};

});