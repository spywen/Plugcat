angular.module('plugcat.favico', [])
.factory('favico', [
function() {
    var favico = new Favico({
        animation : 'slide',
        position: 'upleft'
    });

    var badge = function(num) {
        favico.badge(num);
    };
    var reset = function() {
        favico.reset();
    };

    return {
        badge : badge,
        reset : reset
    };
}]);