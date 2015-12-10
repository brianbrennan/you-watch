angular.module('authCtrl', [])

	.controller('authController', function($location, $http, $window, $rootScope, $scope){
		var token = $location.search();

		if(token.error)
			$location.path($rootScope.getCookie('ggLastPage'));

		$http.get('https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=' + token.access_token)
			.success(function(res){
				console.log(res);
				if(res.audience != $scope.settings.client_id)
					$location.path($rootScope.getCookie('ggLastPage'));

				var authString = 'token=' + token.access_token + '&expires=' + res.expires_in;
				$rootScope.setCookie('ggAuthentication', authString);
				console.log($rootScope.getCookie('ggAuthentication'));
				$location.url($rootScope.getCookie('ggLastPage'));
			});
	});