angular.module('plugcat.menu', [
	'ngCookies',
	'pascalprecht.translate'
])
.run(function($mdToast, $cookieStore, $translate, $timeout) {
	$timeout(function(){
		if(!$cookieStore.get('plugcat_cookiesAuthorization')){
			var toast = $mdToast.simple()
			.content($translate.instant('MENU_COOKIES_AUTO'))
			.action("Ok!")
			.hideDelay(0)
			.position('top right');
			$mdToast.show(toast).then(function() {
		      	$cookieStore.put('plugcat_cookiesAuthorization',true);
		    });
		}
	}, 1000);
}).controller('menuCtrl',function($scope, $mdToast, $cookieStore, $translate){

}).directive('menu',function($mdToast){
	return {
		templateUrl:'menu.html',
		controller:'menuCtrl'
	};
});