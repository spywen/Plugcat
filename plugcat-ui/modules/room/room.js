angular.module('plugcat.room', [
	'cfp.hotkeys',
	'pascalprecht.translate',
	'plugcat.favico',
	'plugcat.presence',
	'plugcat.authManager',
	'plugcat.dataService.colorsService',
	'plugcat.dataService.authService',


	'plugcat.webrtc'
])
.config(function ($routeProvider){
    $routeProvider.when("/room/:name",{
    	title: 'Loading - Plugcat',
    	from:"room",
        controller: 'roomCtrl',
        templateUrl: "room.html",
        resolve:{
        	token: function(authService){
        		return authService.getToken();
        	}
        }
    });
})
.controller('roomCtrl', function(VideoStream, $sce, 		 $scope, $translate, $rootScope, $routeParams, plugsocket, hotkeys, favico, presence, authManager, colorsService, token, plugtoast){
	

    $scope.peers = [];

	if (!window.RTCPeerConnection || !navigator.getUserMedia) {
      plugtoast.error($translate.instant('GENERIC_ERROR'));
      return;
    }

    var iceConfig = { 'iceServers': [{ 'url': 'stun:stun.l.google.com:19302' }]},
        peerConnections = {},
        currentId, roomId,
        stream,
        streamUrl;

    $scope.videoAuthorized = false;

    VideoStream.get()
    .then(function (s) {
        stream = s;
        streamUrl = URL.createObjectURL(s);
        $scope.videoAuthorized = true;
    }, function () {
      $scope.error = 'No audio/video permissions. Please refresh your browser and allow the audio/video capturing.';
    });

    function getPeerConnection(id) {
      /*if (peerConnections[id]) {
        return peerConnections[id];
      }*/
      var pc = new RTCPeerConnection(iceConfig);
      peerConnections[id] = pc;
      pc.addStream(stream);
      pc.onicecandidate = function (evnt) {
        plugsocket.emit('msg', { by: currentId, to: id, ice: evnt.candidate, type: 'ice' });
      };
      pc.onaddstream = function (evnt) {
        console.log('Received new stream');
        $scope.peers.push({
            id: id,
            stream: $sce.trustAsResourceUrl(URL.createObjectURL(evnt.stream))
        });
        /*api.trigger('peer.stream', [{
          id: id,
          stream: evnt.stream
        }]);
        if (!$rootScope.$$digest) {
          $rootScope.$apply();
        }*/
      };
      return pc;
    }

    function makeOffer(id) {
      var pc = getPeerConnection(id);
      pc.createOffer(function (sdp) {
        pc.setLocalDescription(sdp);
        console.log('Creating an offer for', id);
        plugsocket.emit('msg', { by: currentId, to: id, sdp: sdp, type: 'sdp-offer' });
      }, function (e) {
        console.log(e);
      },
      { mandatory: { offerToReceiveVideo: true, offerToReceiveAudio: true }});
    }

    function handleMessage(data) {
      var pc = getPeerConnection(data.by);
      switch (data.type) {
        case 'sdp-offer':
          pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
            console.log('Setting remote description by offer');
            pc.createAnswer(function (sdp) {
              pc.setLocalDescription(sdp);
              plugsocket.emit('msg', { by: currentId, to: data.by, sdp: sdp, type: 'sdp-answer' });
            }, function (e) {
              console.log(e);
            });
          }, function (e) {
            console.log(e);
          });
          break;
        case 'sdp-answer':
          pc.setRemoteDescription(new RTCSessionDescription(data.sdp), function () {
            console.log('Setting remote description by answer');
          }, function (e) {
            console.error(e);
          });
          break;
        case 'ice':
          if (data.ice) {
            console.log('Adding ice candidates');
            pc.addIceCandidate(new RTCIceCandidate(data.ice));
          }
          break;
      }
    }


    //var stream;

    $scope.getLocalVideo = function () {
      return $sce.trustAsResourceUrl(streamUrl);
    };

    $scope.startConf = function(){
        makeOffer(token);
    };

    plugsocket.on('msg', function(data){
        handleMessage(data);
    });












	//Set page title :
	$rootScope.title = $routeParams.name + ' - Plugcat';

	//Room
	$scope.room = {
		name: $routeParams.name,
		messages: []
	};
	$scope.users = [];

	//Message
	$scope.newMessageContent = '';
	$scope.count = 0;


	$scope.currentUser = authManager.getUserConnected();
	$scope.settings = {};


	//Load room
	$scope.loadRoom = function(){
		//Join room
		plugsocket.emit("joinRoom", {roomName: $routeParams.name, token: token}, function(room){
            $scope.users = room.users;
        });

		//Get colors
		colorsService.findAll().then(function(colors){
			$scope.settings = {colors: colors};
		}, function(){
			plugtoast.error($translate.instant('GENERIC_ERROR'));
		});
	};

	//Message to send
	$scope.sendMessage = function(){
		if($scope.newMessageContent.length !== 0){
			var newMessage = {
				room: $routeParams.name,
				content: $scope.newMessageContent
			};
			$scope.newMessageContent = '';
			plugsocket.emit("messageOut", newMessage, function(message){
                message.iAmOwner = true;
                $scope.room.messages.push(message);
            });
		}
	};

	//Message received
	plugsocket.on("messageIn", function(message){
		message.iAmOwner = false;
		$scope.room.messages.push(message);

		//Play sound
		var audio = new Audio('/static/sounds/alert1.mp3');
		audio.play();

		//Add notification
		$scope.count++;
		favico.badge($scope.count);
    });

	//User joined the room
    plugsocket.on("userEvent", function(data){
    	$scope.users = data.room.users;
    	var info = {
    		type:'info',
    		event:data.type,//join or leave
    		publicName: data.profile.publicName
    	};
    	$scope.room.messages.push(info);
    });    



    presence.onChange(function(state) {
    	$scope.count = 0;
	    favico.reset();
	});

    hotkeys.add({
		combo: 'enter',
		allowIn: ['INPUT', 'TEXTAREA'],
		callback: function() {
			$scope.sendMessage();
			event.preventDefault();
		}
	});

	document.onkeydown = function(e) {
	  	document.querySelector(".messageInput").focus();
	};

}).directive('keepScrollBot', function ($timeout) {
  return {
    scope: {
      keepScrollBot: "="
    },
    link: function ($scope, $element) {
      $scope.$watchCollection('keepScrollBot', function (newValue) {
        if (newValue)
        {
        	$timeout(function(){
        		$element[0].scrollTop = $element[0].scrollHeight;
        	}, 0);
        }
      });
    }
  };
});