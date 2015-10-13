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
        templateUrl: "settings.html",
        resolve: {
        	colors: function(colorsService, plugtoast, $translate){
        		return colorsService.findAll().then(function(colors){
        			return colors;
        		}, function(){
					plugtoast.error($translate.instant('GENERIC_ERROR'));
				});
        	}
        }
    });
})
.controller('settingsCtrl',function($scope, colors, settingsService, plugtoast, $translate, authManager){

	$scope.settings = {
		publicName: _.isUndefined(window.user.publicName) ? window.user.givenName : window.user.publicName,
		color: _.isUndefined(window.user.color) ? _.result(_.findWhere(colors, {'default':true}), 'background') : window.user.color
	};
	$scope.colors = colors;


	$scope.submit = function(){
		settingsService.save($scope.settings).then(function(profile){
			plugtoast.success($translate.instant('SAVED'));
			//Refresh window.user
			authManager.refreshUserConnected();
		},function(){
			plugtoast.error($translate.instant('GENERIC_ERROR'));
		});
	};

});