angular.module('plugcat.translate', [
    'pascalprecht.translate',
    'ngCookies'
])
.config(function($translateProvider){
    //Translate
    $translateProvider.useStaticFilesLoader({
        prefix: '/static/lang/',
        suffix: '.json'
    });
    $translateProvider.useCookieStorage();
    $translateProvider.preferredLanguage('en');
    $translateProvider.useSanitizeValueStrategy('escaped');
})
.controller('translateCtrl', function($scope, $translate, $cookieStore) {

    $scope.en = false;
    $scope.fr = false;

    var currentLanguage = $cookieStore.get('NG_TRANSLATE_LANG_KEY');
    if(currentLanguage === 'en'){
        $scope.en = true;
    }else if(currentLanguage === 'fr'){
        $scope.fr = true;
    }else{
        $scope.en = true;
    }

    $scope.changeLanguage = function (langKey){
        $translate.use(langKey);
        $scope.en = false;
        $scope.fr = false;
        if(langKey === 'en'){
            $scope.en = true;
        }else if(langKey === 'fr'){
            $scope.fr = true;
        }else{
            $scope.en = true;
        }
    };
});