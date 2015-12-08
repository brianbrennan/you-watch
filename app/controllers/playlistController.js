angular.module('playlistCtrl', [])

	.controller('playlistController', function($http, $scope, $location, $sce){
		var playlistId = $location.path().substr(11,$location.path().length - 1);
		console.log(playlistId);

		$scope.loading = true;

		$scope.finished = false;

		getVideos();

		s('.show-hide').on('click', function(){
			getMore();
		});

				

		function getVideos(){
			
			$http.get(' https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2C+snippet&playlistId=' + playlistId + '&maxResults=9&key=' + $scope.settings.api_key)
				.success(function(res){
					console.log(res);
					$scope.videos = res.items;
					$scope.nextToken = res.nextPageToken;
					getPlaylistName();
					$scope.loading = false;
				});
			
		}

		function getPlaylistName(){
			$http.get('https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=' + playlistId + '&key=' + $scope.settings.api_key )
				.success(function(res){
					$scope.playlistTitle = res.items[0].snippet.title;
				});
		}

		function getMore(){
			$scope.loading = true;
			
			$http.get(' https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails%2C+snippet&playlistId=' + playlistId + '&maxResults=9&pageToken=' + $scope.nextToken + '&key=' + $scope.settings.api_key)
				.success(function(res){
					for(var i = 0; i < res.items.length; i++){
						$scope.videos.push(res.items[i]);
					}
					$scope.nextToken = res.nextPageToken;

					$scope.loading = false;
				});
			
		}
	});