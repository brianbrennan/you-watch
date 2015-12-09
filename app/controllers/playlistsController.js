angular.module('playlistsCtrl', [])

	.controller('playlistsController', function($http, $scope, $location, $rootScope){
		$rootScope.pageTitle = "Game Grumps Playlists";
		$scope.loading = true;
		$http.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + $scope.settings.channel + '&key=' + $scope.settings.api_key)
			.success(function(res){
				$scope.channelId = res.items[0].id;

				getPlaylists();

				s('.show-hide').on('click', function(){
					getMore();
				});
			});

		function getPlaylists(){
			$http.get('https://www.googleapis.com/youtube/v3/playlists?part=contentDetails%2csnippet&channelId=' + $scope.channelId +  '&maxResults=9&key=' + $scope.settings.api_key)
				.success(function(res){
					$scope.playlists = res.items;
					$scope.nextToken = res.nextPageToken;
				});

				$scope.loading = false;
		}

		function getMore(){
			$scope.loading = true;
			$http.get('https://www.googleapis.com/youtube/v3/playlists?part=contentDetails%2csnippet&channelId=' + $scope.channelId +  '&maxResults=9&pageToken=' + $scope.nextToken + '&key=' + $scope.settings.api_key)
				.success(function(res){
					for(var i = 0; i < res.items.length; i++){
						$scope.playlists.push(res.items[i]);
					}
					$scope.nextToken = res.nextPageToken;
					$scope.loading = false;
				})
		}
	});