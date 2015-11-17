angular.module('playlistCtrl', [])

	.controller('playlistController', function($http, $scope, $location, $sce){
		var playlistId = $location.path().substr(11,$location.path().length - 1);

		$http.get('https://www.googleapis.com/youtube/v3/playlists?part=snippet&id=' + playlistId + '&key=' + $scope.settings.api_key)

			.success(function(res){
				// if(typeof res.items !== 'undefined' && typeof res.items[0].snippet !== 'undefined'){

				// 	vm.p = res;
				// 	console.log(vm.p);
				// 	if(res.items[0].snippet.channelTitle === $scope.settings.channel){
				// 		s('.playlist').insert('<iframe width="800" height="450" src="http://www.youtube.com/embed/videoseries?list=' + playlistId + '&autoplay=0&showinfo=0" frameborder="0" allowfullscreen></iframe>');
				// 	} else {
				// 		$location.path('/404');
				// 	}
				// } else {
				// 	$location.path('/404');
				// }

				console.log(res);

				$scope.playlist = res.items[0];
				$scope.playlist.player = $sce.trustAsResourceUrl('http://www.youtube.com/embed/videoseries?list=' + playlistId + '&autoplay=0&showinfo=0');
			});

			// <iframe width="560" height="315" src="https://www.youtube.com/embed/videoseries?list=PLRQGRBgN_Enrz2vN_aectOAVnKEAPUh6S" frameborder="0" allowfullscreen></iframe>
	});