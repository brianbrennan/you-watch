var route = angular.module('app.routes', ['ngRoute']);

route.config(function($routeProvider, $locationProvider){
		$routeProvider.when('/', {
			templateUrl: 'app/views/home.html'
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

		.when('/404', {
			templateUrl: 'app/views/404.html'
		})
	});
