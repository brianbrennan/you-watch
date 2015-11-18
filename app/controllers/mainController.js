angular.module('mainCtrl', [])

	.controller('mainController', function($http, $scope){
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
			})
	});