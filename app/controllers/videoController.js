angular.module('videoCtrl', [])

	.controller('videoController', function($http, $scope, $location, $sce){


		var video_id = $location.path().substr(8,$location.path().length - 1);

		$http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + video_id + '&key=' + $scope.settings.api_key)

			.success(function(res){

				$scope.video = res.items[0];
				$scope.video.player = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + video_id + '?autoplay=0&showinfo=0');

			});

	});
