angular.module('playlistsCtrl', [])

	.controller('playlistsController', function($http, $scope, $location){
		$http.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + $scope.settings.channel + '&key=' + $scope.settings.api_key)
			.success(function(res){
				$scope.channelId = res.items[0].id;

				getPlaylists();
			});

		function getPlaylists(){
			$http.get('https://www.googleapis.com/youtube/v3/playlists?part=contentDetails%2csnippet&channelId=' + $scope.channelId + '&key=' + $scope.settings.api_key)
				.success(function(res){
					$scope.playlists = res.items;
				});
		}
	});