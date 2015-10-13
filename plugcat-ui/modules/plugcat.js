angular.module('plugcat',[
	'ngRoute',
	'ngMaterial',
	'restangular',
	'plugcat.socket',
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
.config(function($routeProvider, $plugsocketProvider, $locationProvider, RestangularProvider, cfpLoadingBarProvider){
	$locationProvider.html5Mode(true);
	RestangularProvider.setBaseUrl('api/');
	cfpLoadingBarProvider.latencyThreshold = 0;
	cfpLoadingBarProvider.includeBar = true;
	cfpLoadingBarProvider.includeSpinner = true;
	$plugsocketProvider.init(window.location.origin);
})
.run(function($rootScope, plugsocket) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
        if(!_.isUndefined(previous) && previous.from === "room"){
        	plugsocket.emit("forceDisconnection");
        }
    });
})
.controller('mainCtrl', function(){
 
});