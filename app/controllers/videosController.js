angular.module('videosCtrl', [])

	.controller('videosController', function($http, $scope){
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
			
			$http.get(' https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2C+snippet&playlistId=' + $scope.uploadsPlaylistId + '&maxResults=9&key=' + $scope.settings.api_key)
				.success(function(res){
					$scope.videos = res.items;
					$scope.nextToken = res.nextPageToken;
					$scope.loading = false;
				});
			
		}

		function getMore(){
			$scope.loading = true;
			
			$http.get(' https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2C+snippet&playlistId=' + $scope.uploadsPlaylistId + '&maxResults=9&pageToken=' + $scope.nextToken + '&key=' + $scope.settings.api_key)
				.success(function(res){
					for(var i = 0; i < res.items.length; i++){
						$scope.videos.push(res.items[i]);
					}
					$scope.nextToken = res.nextPageToken;

					$scope.loading = false;
				});
			
		}
	});