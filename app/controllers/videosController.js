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
					$scope.videos = [];
					$scope.nextToken = res.nextPageToken;

					for(var i = 0; i < res.items.length; i++){
						if(res.items[i].snippet.type === 'upload'){
							$scope.videos.push(res.items[i]);
						}
					}

					
					$scope.loading = false;
				});
			
		}

		function getMore(){
			$scope.loading = true;
			
			$http.get('https://www.googleapis.com/youtube/v3/activities?part=contentDetails%2Csnippet&channelId=' + $scope.channelId + '&maxResults=9&pageToken=' + $scope.nextToken + '&key=' + $scope.settings.api_key)
				.success(function(res){

					console.log(res);



					$scope.nextToken = res.nextPageToken;

					for(var i = 0; i < res.items.length; i++){
						if(res.items[i].snippet.type === 'upload'){
							$scope.videos.push(res.items[i]);
						}
					}
					$scope.loading = false;
				});
			
		}

		$scope.sortDate = function(v){
			var date = new Date(v.snippet.publishedAt);
			return date;
		};
	});