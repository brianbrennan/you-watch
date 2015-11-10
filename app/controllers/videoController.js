angular.module('videoCtrl', [])

	.controller('videoController', function($http, $scope, $location){

		var video_id = $location.path().substr(8,$location.path().length - 1);

		console.log(video_id);

		$http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + video_id + '&key=' + $scope.settings.api_key)
			.success(function(res){
				if(typeof res.items !== 'undefined' && typeof res.items[0].snippet !== 'undefined'){
					console.log(res.items[0].snippet.channelTitle);
					console.log($scope.settings.channel);
					if(res.items[0].snippet.channelTitle === $scope.settings.channel){
						s('.video').insert('<iframe width="800" height="450" src="http://www.youtube.com/embed/' + video_id + '?autoplay=1&showinfo=0" frameborder="0"></iframe>');
					} else {
						$location.path('/404');
					}
				} else {
					$location.path('/404');
				}
			});

	});
