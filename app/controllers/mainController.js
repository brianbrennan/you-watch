angular.module('mainCtrl', [])

	.controller('mainController', function($http, $scope, $rootScope, $window, $location){

		$rootScope.pageTitle = "Game Grumps | A Fan Made Site";

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

		$rootScope.isAuth = function(){

			if($rootScope.getCookie('ggAuthenticaion'))
				return true;
			else
				return false;
		};

		$rootScope.checkAuth = function(){
			if($rootScope.isAuth()){

			} else {
				$rootScope.setCookie('ggLastPage', $location.path(), 1);
				window.location='https://accounts.google.com/o/oauth2/auth?client_id=' + $scope.settings.client_id + '&redirect_uri=http%3A%2F%2Flocalhost%3A8000&response_type=token&scope=https%3A%2F%2Fwww%2Egoogleapis%2Ecom%2Fauth%2Fyoutube%2Eforce-ssl';
			}
		};

		$rootScope.setCookie = function (cname, cvalue, exdays) {
			var d = new Date();
			d.setTime(d.getTime() + (exdays*24*60*60*1000));
			var expires = "expires="+d.toUTCString();
			document.cookie = cname + "=" + cvalue + "; " + expires;
		};

		$rootScope.getCookie = function (cname) {
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for(var i=0; i<ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1);
				if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
			}
			return false;
		};
	});