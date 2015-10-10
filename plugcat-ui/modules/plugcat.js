angular.module('plugcat',[
	'ngRoute',
	'ngMaterial',
	'restangular',
	'plugcat.plugconsts',
	'plugcat.plugtoast',
	'ngAnimate',
	'angular-loading-bar',
	
	'plugcat.partial',
	'plugcat.translate',
	'plugcat.menu',
	'plugcat.logo',
	'plugcat.home',
	'plugcat.room',
	'plugcat.settings'
])
.config(function($routeProvider,$locationProvider, RestangularProvider, cfpLoadingBarProvider){
	$locationProvider.html5Mode(true);
	RestangularProvider.setBaseUrl('api/');
	cfpLoadingBarProvider.latencyThreshold = 0;
	cfpLoadingBarProvider.includeBar = true;
	cfpLoadingBarProvider.includeSpinner = true;
})
.run(function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
})
.controller('mainCtrl', function(){
 
});