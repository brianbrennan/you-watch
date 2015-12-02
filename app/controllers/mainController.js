angular.module('mainCtrl', [])

	.controller('mainController', function($http, $scope, $rootScope, $window, $location){
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
		});
	});