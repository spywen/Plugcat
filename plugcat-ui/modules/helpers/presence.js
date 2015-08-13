angular.module('plugcat.presence', ['presence'])
.factory('presence', function($presence) {
  return $presence.init({
    TYPING : {
      accept: "KEYBOARD"
    },
    IDLE : {
      enter: 2000, initial: true
    }
    /*,
    SHORTAWAY : {
      enter: 5000, text: "Ok, i think you're gone."
    },
    LONGAWAY : {
      enter: 10000, text: "You're definetly gone... but you should type something."
    }*/
  });
});