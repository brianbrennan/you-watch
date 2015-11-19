angular.module('homeCtrl', [])

	.controller('homeController', function($http, $scope){

		$scope.loading = true;
		$http.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + $scope.settings.channel + '&key=' + $scope.settings.api_key)
			.success(function(res){
				$scope.uploadsPlaylistId = res.items[0].contentDetails.relatedPlaylists.uploads;

				getVideos();

				s('.show-hide').on('click', function(){
					getMore();
				});

				
			});

		function getVideos(){
			
			$http.get(' https://www.googleapis.com/youtube/v3/playlistItems?part=snippet%2ccontentDetails&playlistId=' + $scope.uploadsPlaylistId + '&maxResults=1&key=' + $scope.settings.api_key)
				.success(function(res){
					$scope.mostRecent = res;
					
				});
			
		}
	});