angular.module('videosCtrl', [])

	.controller('videosController', function($http, $scope){
		$scope.loading = true;
		$http.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + $scope.settings.channel + '&key=' + $scope.settings.api_key)
			.success(function(res){
				$scope.channelId = res.items[0].id;

				getVideos();

				s('.show-hide').on('click', function(){
					getMore();
				});

				
			});

		function getVideos(){
			
			$http.get('https://www.googleapis.com/youtube/v3/activities?part=contentDetails%2Csnippet&channelId=' + $scope.channelId + '&maxResults=9&key=' + $scope.settings.api_key)
				.success(function(res){
					$scope.videos = res.items;
					$scope.nextToken = res.nextPageToken;
					$scope.loading = false;
				});
			
		}

		function getMore(){
			$scope.loading = true;
			
			$http.get('https://www.googleapis.com/youtube/v3/activities?part=contentDetails%2Csnippet&channelId=' + $scope.channelId + '&maxResults=9&pageToken=' + $scope.nextToken + '&key=' + $scope.settings.api_key)
				.success(function(res){
					console.log(res);
					for(var i = 0; i < res.items.length; i++){
						if(typeof res.items[i].contentDetails.upload !== 'undefined')
							$scope.videos.push(res.items[i]);
						else
							notUpload()

					}
					$scope.nextToken = res.nextPageToken;

					$scope.loading = false;
				});
			
		}

		function notUpload(){
			$scope.loading = true;
			
			$http.get('https://www.googleapis.com/youtube/v3/activities?part=contentDetails%2Csnippet&channelId=' + $scope.channelId + '&maxResults=1&pageToken=' + $scope.nextToken + '&key=' + $scope.settings.api_key)
				.success(function(res){
					console.log(typeof res.items[0].contentDetails.upload);
					for(var i = 0; i < res.items.length; i++){
						if(typeof res.items[i].contentDetails.upload !== 'undefined')
							return $scope.videos.push(res.items[i]);
						else
							notUpload()
					}
					$scope.nextToken = res.nextPageToken;

					$scope.loading = false;
				});
		}
	});