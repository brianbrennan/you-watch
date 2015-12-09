angular.module('oneOffsCtrl', [])

	.controller('oneOffsController', function($scope, $http){
		$scope.loading = true;

		getVideos();

		s('.show-hide').on('click', function(){
			getMore();
		});



		function getVideos(){
			
			$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLRQGRBgN_EnqIWG6TuaGLWmn9NLcaHi7P&maxResults=9&key=' + $scope.settings.api_key)
				.success(function(res){
					console.log(res);
					$scope.videos = [];
					$scope.nextToken = res.nextPageToken;


					for(var i = 0; i < res.items.length; i++){
						$scope.videos.push(res.items[i]);
					}
						$scope.loading = false;

				});
			
		}

		function getMore(){
			$scope.loading = true;
			
			$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLRQGRBgN_EnqIWG6TuaGLWmn9NLcaHi7P&pageToken=' + $scope.nextToken + '&maxResults=9&key=' + $scope.settings.api_key)
				.success(function(res){

					console.log(res);



					$scope.nextToken = res.nextPageToken;

					for(var i = 0; i < res.items.length; i++){
						$scope.videos.push(res.items[i]);
					}

					$scope.loading = false;
				});
			
		}

		$scope.sortDate = function(v){
			var date = new Date(v.snippet.publishedAt);
			return date;
		};
	});