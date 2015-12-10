angular.module('redirectAuthCtrl', [])

	.controller('redirectAuthController', function($http, $scope, $rootScope, $window, $location){
		var token = $location.path().substring(1, $location.path().length);
		$location.url('auth?' + token);
	});
