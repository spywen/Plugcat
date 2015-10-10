describe('plugcat.dataService.authService', function(){
	var $httpBackend, authService, Restangular;

	beforeEach(module('plugcat.dataService.authService'));

	beforeEach(inject(function(_$httpBackend_, _authService_, _Restangular_){
		$httpBackend = _$httpBackend_;
		Restangular = _Restangular_;
		authService = _authService_;
	}));
	
	afterEach(function() {
        $httpBackend.verifyNoOutstandingRequest();
        $httpBackend.verifyNoOutstandingExpectation();
    });

	it('should get current user connected data', function(){
		$httpBackend.expectGET('/auth').respond();
		authService.getConnectedUser();
        $httpBackend.flush();
	});
});