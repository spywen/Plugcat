angular.module('plugcat.configs', [])
.factory('configs', function () {
    return {
        socket:{
            url:'http://localhost',
            port:8080
        }
    };
});