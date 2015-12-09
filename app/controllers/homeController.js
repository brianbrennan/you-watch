angular.module('homeCtrl', [])

	.controller('homeController', function($http, $scope, $rootScope){

		$rootScope.pageTitle="Game Grumps | A Fan Made Site"

		$scope.recentLoading = true;
		$http.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + $scope.settings.channel + '&key=' + $scope.settings.api_key)
			.success(function(res){
				$scope.uploadsPlaylistId = res.items[0].contentDetails.relatedPlaylists.uploads;

				getVideos();

				
			});

		function getVideos(){
			
			$http.get(' https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2ccontentDetails&playlistId=' + $scope.uploadsPlaylistId + '&maxResults=4&key=' + $scope.settings.api_key)
				.success(function(res){
					$scope.mostRecent = res.items;
					
					$scope.recentLoading = false;
				});
			
		}
	});