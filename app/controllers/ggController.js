angular.module('ggCtrl', [])

	.controller('ggController', function($scope, $http){
		$scope.loading = true;
		$http.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + $scope.settings.channel + '&key=' + $scope.settings.api_key)
			.success(function(res){
				$scope.channelId = res.items[0].id;
				$scope.uploadPlaylist = res.items[0].contentDetails.relatedPlaylists.uploads;

				getVideos();

				s('.show-hide').on('click', function(){
					getMore();
				});

				
			});

		function getVideos(){
			
			$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + $scope.uploadPlaylist +'&maxResults=20&key=' + $scope.settings.api_key)
				.success(function(res){
					$scope.videos = [];
					$scope.nextToken = res.nextPageToken;

					var none = true;

					for(var i = 0; i < res.items.length; i++){
						var index = res.items[i].snippet.title.indexOf('Game Grumps');
						if(index > 0){
							$scope.videos.push(res.items[i]);
							none = false;
						}
					}

					if(none)
						getMore();
					else
						$scope.loading = false;

					
					
				});
			
		}

		function getMore(){
			$scope.loading = true;
			
			$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + $scope.uploadPlaylist + '&pageToken=' + $scope.nextToken + '&maxResults=20&key=' + $scope.settings.api_key)
				.success(function(res){



					$scope.nextToken = res.nextPageToken;

					var none = true;

					for(var i = 0; i < res.items.length; i++){
						var index = res.items[i].snippet.title.indexOf('Game Grumps');
						if(index > 0){
							$scope.videos.push(res.items[i]);
							none = false;
						}
					}
					if(none)
						getMore();
					else
						$scope.loading = false;
				});
			
		}

		$scope.sortDate = function(v){
			var date = new Date(v.snippet.publishedAt);
			return date;
		};
	});