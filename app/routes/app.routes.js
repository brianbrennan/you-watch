var route = angular.module('app.routes', ['ngRoute']);

route.config(function($routeProvider, $locationProvider){
		$routeProvider.when('/', {
			templateUrl: 'app/views/home.html',
			controller: 'homeController',
			controllerAs: 'home'
		})

		.when('/videos/', {
			templateUrl: 'app/views/videos.html',
			controller: 'videosController',
			controllerAs: 'videos'
		})

		.when('/videos/:video_id', {
			templateUrl: 'app/views/video.html',
			controller: 'videoController',
			controllerAs: 'video'
		})

		.when('/playlists/', {
			templateUrl: 'app/views/playlists.html',
			controller: 'playlistsController',
			controllerAs: 'playlists'

		})

		.when('/playlists/:playlist_id', {
			templateUrl: 'app/views/playlist.html',
			controller: 'playlistController',
			controllerAs: 'playlist'

		})

		.when('/404', {
			templateUrl: 'app/views/404.html'
		})
	});
