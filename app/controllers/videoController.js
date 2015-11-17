angular.module('videoCtrl', [])

	.controller('videoController', function($http, $scope, $location, $sce){


		var video_id = $location.path().substr(8,$location.path().length - 1);

		$http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + video_id + '&key=' + $scope.settings.api_key)

			.success(function(res){

				$scope.video = res.items[0];

				//Give a formatted date for the view
				setPublishAtDate();

				//Formats Description
				preserveDescription();

				$scope.video.player = $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + video_id + '?autoplay=0&showinfo=0');

				s('.show-hide').on('click', function(){
					if(s('.description').hasClass('full')[0]){
						s('.description').removeClass('full');
						s(this).innerHtml('Show More');
					} else {
						s('.description').addClass('full');
						s(this).innerHtml('Hide');
					}
				});

			});

		function setPublishAtDate(){
			var date = new Date($scope.video.snippet.publishedAt);

			var formattedDate = '';

			switch(date.getMonth()){
				case 0:
					formattedDate = 'January';
					break;
				case 1:
					formattedDate = 'February';
					break;
				case 2:
					formattedDate = 'March';
					break;
				case 3:
					formattedDate = 'April';
					break;
				case 4:
					formattedDate = 'May';
					break;
				case 5:
					formattedDate = 'June';
					break;
				case 6:
					formattedDate = 'July';
					break;
				case 7:
					formattedDate = 'August';
					break;
				case 8:
					formattedDate = 'September';
					break;
				case 9:
					formattedDate = 'October';
					break;
				case 10:
					formattedDate = 'November';
					break;
				case 11:
					formattedDate = 'December';
					break;
			}

			formattedDate = formattedDate + ' ' + date.getDate() + ', ' + date.getFullYear();

			$scope.video.snippet.publishedAt = formattedDate;
		}

		function preserveDescription(){
			var description = $scope.video.snippet.description;

			description = preserveLinks(description);

			description = description.replace(/\n/g, "<br>");

			$scope.video.snippet.description = description;
		}

		function preserveLinks(d){
			d = d.replace( /(http:\/\/[^\s]+)/gi , '<a href="$1">$1</a>' );
			d = d.replace( /(https:\/\/[^\s]+)/gi , '<a href="$1">$1</a>' );

			return d;
		}

	})

	.filter('unsafe', function($sce) {

		return function(val) {

			return $sce.trustAsHtml(val);

		};

	});

