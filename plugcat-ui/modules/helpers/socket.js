angular.module('plugcat.socket', [])
.provider('$plugsocket', function () {
    var socket;
    return {
        init:function(url){
            socket = io.connect(url);
        },

        $get: function(){
            return socket;
        }
    };
}).factory('plugsocket', function($rootScope, $location, $plugsocket){
    return {
        on: function (eventName, callback) {
            function wrapper() {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply($plugsocket, args);
                });
            }
 
            $plugsocket.on(eventName, wrapper);
 
            return function () {
                $plugsocket.removeListener(eventName, wrapper);
            };
        },
 
        emit: function (eventName, data, callback) {
            $plugsocket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if(callback) {
                        callback.apply($plugsocket, args);
                    }
                });
            });
        }
    };
});