angular.module('mainCtrl', [])

	.controller('mainController', function($http, $scope){
		$http.get('app/model/settings.json')
			.success(function(res){
				$scope.settings = res;
			});
	});