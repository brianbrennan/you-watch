angular.module('videosCtrl', [])

	.controller('videosController', function($http, $scope){
		$http.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + $scope.settings.channel + '&key=' + $scope.settings.api_key)
			.success(function(res){
				$scope.uploadsPlaylistId = res.items[0].contentDetails.relatedPlaylists.uploads;

				getVideos();
			});

		function getVideos(){
			$http.get(' https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2C+snippet&playlistId=' + $scope.uploadsPlaylistId + '&key=' + $scope.settings.api_key)
				.success(function(res){
					$scope.videos = res.items;
				})
		}
	});