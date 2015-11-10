angular.module('videoCtrl', [])

	.controller('videoController', function($http, $scope, $location){

		var video_id = $location.path().substr(8,$location.path().length - 1);

		$http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + video_id + '&key=' + $scope.settings.api_key)
			.success(function(res){
				if(typeof res.items !== 'undefined' && typeof res.items[0].snippet !== 'undefined'){
					if(res.items[0].snippet.channelTitle === $scope.settings.channel){
						s('body').insert('<iframe width="800" height="450" src="http://www.youtube.com/embed/' + video_id + '?autoplay=1&showinfo=0" frameborder="0"></iframe>');
					} else {
						$location.path('/404');
					}
				} else {
					$location.path('/404');
				}
			});

	});
