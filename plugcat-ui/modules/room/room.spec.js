describe('plugcat.home', function(){

    var $scope, $rootScope, $route, createController, $location, homeVar, socket;

    beforeEach(module('plugcat.home'));

    beforeEach(function(){
        homeVar = {
            roomPath: '/room/'
        };
    });

    beforeEach(inject(function (_$location_, _$route_, _$rootScope_, _homeVar_) {
        $rootScope =_$rootScope_;
        $location = _$location_;
        route = _$route_;
        homeVar = _homeVar_;
    }));

    beforeEach(inject(function ($controller) {
        $scope = $rootScope.$new();
        createController = function () {
            return $controller('homeCtrl', {
                '$scope': $scope
            });
        };
    }));


    beforeEach(function(){
        createController();
    });


    describe('Home route', function() {
        beforeEach(inject(
            function($httpBackend) {
                $httpBackend.expectGET('home.html').respond(200);
            })
        );

        it('should load the home page on successful load of /', function() {
            $location.path('/');
            $rootScope.$digest();
            expect(route.current.controller).toBe('homeCtrl');
        });
    });

    describe('Go to a room', function(){

        beforeEach(function(){
            $scope.room = {
                name : "MAROOM"
            };
            spyOn($location, 'path').and.callThrough();
            $scope.goToRoom();
        });

        it('should go to the right room', function(){
            expect($location.path).toHaveBeenCalledWith(homeVar.roomPath + $scope.room.name);
        });

    });

});