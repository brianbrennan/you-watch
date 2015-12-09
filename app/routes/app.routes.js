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

		.when('/gg/', {
			templateUrl: 'app/views/gg.html',
			controller: 'ggController',
			controllerAs: 'gg'
		})

		.when('/steam-train/', {
			templateUrl: 'app/views/st.html',
			controller: 'stController',
			controllerAs: 'st'
		})

		.when('/grumpcade/', {
			templateUrl: 'app/views/gc.html',
			controller: 'gcController',
			controllerAs: 'gc'
		})

		.when('/animated', {
			templateUrl: 'app/views/animated.html',
			controller: 'animatedController',
			controllerAs: 'animated'
		})

		.when('/best-of', {
			templateUrl: 'app/views/bestOf.html',
			controller: 'bestOfController',
			controllerAs: 'bestOf'
		})

		.when('/table-flip', {
			templateUrl: 'app/views/tableFlip.html',
			controller: 'tableFlipController',
			controllerAs: 'tableFlip'
		})

		.when('/one-offs', {
			templateUrl: 'app/views/oneOffs.html',
			controller: 'oneOffsController',
			controllerAs: 'oneOffs'
		})

		.when('/guild-grumps', {
			templateUrl: 'app/views/guildGrumps.html',
			controller: 'guildGrumpsController',
			controllerAs: 'guildGrumps'
		})

		.when('/commercials', {
			templateUrl: 'app/views/commercials.html',
			controller: 'commercialsController',
			controllerAs: 'commercials'
		})

		.when('/search', {
			templateUrl: 'app/views/search.html',
			controller: 'searchController',
			controllerAs: 'search'
		})

		.when('/:anything', {
			templateUrl: 'app/views/404.html'
		})
	});
