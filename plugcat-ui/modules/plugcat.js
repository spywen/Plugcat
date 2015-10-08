angular.module('plugcat',[
	'ngRoute',
	'ngMaterial',
	'restangular',
	
	'plugcat.partial',
	'plugcat.translate',
	'plugcat.menu',
	'plugcat.logo',
	'plugcat.home',
	'plugcat.room'
])
.config(function($routeProvider,$locationProvider, RestangularProvider){
	$locationProvider.html5Mode(true);
	RestangularProvider.setBaseUrl('api/');
})
.run(function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        $rootScope.title = current.$$route.title;
    });
})
.controller('mainCtrl', function(){
 
});