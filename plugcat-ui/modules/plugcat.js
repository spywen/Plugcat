angular.module('plugcat',[
	'ngRoute',
	'ngMaterial',
	
	'plugcat.partial',
	'plugcat.translate',
	'plugcat.menu',
	'plugcat.logo',
	'plugcat.home',
	'plugcat.room'
])
.config(function($routeProvider,$locationProvider){
	$locationProvider.html5Mode(true);
})
.controller('mainCtrl', function(){
 
});