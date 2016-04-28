(function(){

	angular.module('videoSnippetSidebarDrct', [])

	.controller('videoSnippetSidebarController',  videoSnippetSidebarController)

	.directive('videoSnippetSidebar', videoSnippetSidebar);

	function videoSnippetSidebarController($scope, $attrs, $location, $http, $rootScope){

		var vm = this;

		vm.videoType = $attrs.videos;

		vm.videos = [];

		getVideos(vm.videoType);

		function getVideos(s){

			vm.snippetLoading = true;

			$http.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + $rootScope.settings.channel + '&key=' + $rootScope.settings.api_key)
			.success(function(res){
				vm.channelId = res.items[0].id;
				vm.uploadPlaylist = res.items[0].contentDetails.relatedPlaylists.uploads;

				if(s == 'whatsUpNext')
					getNextVideo();
				else if(s == 'relatedVideos')
					getRelatedVideos();
				else if(s == 'recentUploads')
					getRecentUploads();
				return;
			});	
		}

		function getNextVideo(){
			
			$http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' + $rootScope.settings.channelId + '&relatedToVideoId=' + $location.path().substr(8,$location.path().length - 1) +'&channelId=' + $rootScope.settings.channelId +'&maxResults=5&type=video&key=' + $rootScope.settings.api_key)

				.success(function(res){
					if(res.items[0].snippet.channelId == $rootScope.settings.channelId)
						vm.videos[0] = res.items[0];
					vm.snippetLoading = false;
				});
		}

		function getRelatedVideos(){
			$http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=' + $rootScope.settings.channelId + '&relatedToVideoId=' + $location.path().substr(8,$location.path().length - 1) +'&channelId=' + $rootScope.settings.channelId +'&maxResults=5&type=video&key=' + $rootScope.settings.api_key)

			.success(function(res){
				for(var i = 1; i < res.items.length; i++){
					if(res.items[i].snippet.channelId == $rootScope.settings.channelId)
						vm.videos.push(res.items[i]);
				}
				vm.snippetLoading = false;
			});
		}

		function getRecentUploads(){

			$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + vm.uploadPlaylist +'&maxResults=5&key=' + $rootScope.settings.api_key)
			.success(function(res){

				vm.nextToken = res.nextPageToken;

				for(var i = 0; i < res.items.length; i++){
					vm.videos.push(res.items[i]);
				}

				vm.snippetLoading = false;
			});
		}	
	}

	function videoSnippetSidebar(){
		return {
			restrict: 'EA',
			name: 'video-sidebar',
			templateUrl: 'app/views/partials/video-snippet-sidebar.html',
			transclude: true,
			controller: 'videoSnippetSidebarController',
			controllerAs: 'videoSnippet',
			bindToController: true,
			scope: {}
		};
	}


})();