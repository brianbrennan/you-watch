angular.module('mainCtrl', [])

	.controller('mainController', function($http, $scope, $rootScope, $window, $location){

		$rootScope.isAuth = false;

		$http.get('app/model/settings.json')
			.success(function(res){
				$scope.settings = res;
			});

		s('.sub-head')
			.on('mouseenter', function(){
				s('.sub').css('display','block');
			})

			.on('mouseleave', function(){
				s('.sub').css('display','none');
			});

		$rootScope.$on('$locationChangeStart', function(event, next, current){
			s('header').removeClass();
		});

		$rootScope.$on('$routeChangeSuccess', function(event, next, current){
			$window.ga('send', 'pageview', { page: $location.path() });
			$rootScope.checkAuth();
		});



		$rootScope.checkAuth = function(){
			if($rootScope.isAuth){

			} else {
				window.location='https://accounts.google.com/o/oauth2/auth?client_id=' + $scope.settings.client_id + '&redirect_uri=http%3A%2F%2Fgamegrumps%2Eco&response_type=token&scope=https%3A%2F%2Fwww%2Egoogleapis%2Ecom%2Fauth%2Fyoutube%2Eforce-ssl';
			}
		};
	});