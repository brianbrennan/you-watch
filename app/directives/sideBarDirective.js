(function(){



angular.module('videoSidebarDrct', [])

	.directive('videoSidebar', videoSidebar);

function videoSidebar(){
    return {
    	restrict: 'EA',
    	name: 'video-sidebar',
        templateUrl: 'app/views/partials/sidebar.html'
    };
}


})();