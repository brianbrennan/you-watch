angular.module('searchCtrl', [])

	.controller('searchController', function($scope, $http, $rootScope){

		$rootScope.pageTitle = 'JonTron can\'t melt steel beams';
		$scope.findQuery = function(){
			$scope.searchLoading = true;
			if($scope.searchQuery.length > 1){
				$http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&channelId=' + $scope.settings.channelId + '&q=' + $scope.searchQuery + '&key=' + $scope.settings.api_key)

				.success(function(res){
					$scope.results = res;
					$scope.searchLoading = false;
					console.log(res);
				})
			}
		};

		$scope.findMore = function(){
			$scope.searchLoading = true;
			$http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&channelId=' + $scope.settings.channelId + '&q=' + $scope.searchQuery + '&pageToken= ' + $scope.results.nextPageToken + '&type=video&key=' + $scope.settings.api_key)

				.success(function(res){
					$scope.results.nextPageToken = res.nextPageToken;
					

					for(var i = 0; i < res.items.length; i++){
						$scope.results.items.push(res.items[i]);
					}

					$scope.searchLoading = false;
				});
		};


	});