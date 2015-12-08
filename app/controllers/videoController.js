angular.module('videoCtrl', [])

	.controller('videoController', function($http, $scope, $location, $sce){


		var video_id = $location.path().substr(8,$location.path().length - 1);

		$http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet%2cstatistics&id=' + video_id + '&key=' + $scope.settings.api_key)

			.success(function(res){

				$scope.video = res.items[0];

				// console.log($scope.video);

				//Give a formatted date for the view
				setPublishAtDate();

				//Formats Description
				preserveDescription();

				//Sidebar loading
				$scope.recentLoading = true;
				sideBar();


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

				
				var likes = Number($scope.video.statistics.likeCount);
				var total = Number($scope.video.statistics.dislikeCount) + likes;

				likeRatio = likes / total * 100;

				s('.like-bar').css('width', String(likeRatio + '%'));


				$scope.video.statistics.viewCount = numberWithCommas($scope.video.statistics.viewCount);
				$scope.video.statistics.likeCount = numberWithCommas($scope.video.statistics.likeCount);
				$scope.video.statistics.dislikeCount = numberWithCommas($scope.video.statistics.dislikeCount);


				//update header
				checkShow();

				
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

		function numberWithCommas(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		function sideBar(){
			$http.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + $scope.settings.channel + '&key=' + $scope.settings.api_key)
			.success(function(res){
				$scope.channelId = res.items[0].id;

				getVideos();
			});
		}

		function getVideos(){

			$scope.recentLoading = true;
			
			$http.get('https://www.googleapis.com/youtube/v3/activities?part=contentDetails%2Csnippet&channelId=' + $scope.channelId + '&maxResults=5&key=' + $scope.settings.api_key)
			.success(function(res){
				$scope.recentVideos = [];
				$scope.nextToken = res.nextPageToken;

				for(var i = 0; i < res.items.length; i++){
					if(res.items[i].snippet.type === 'upload'){
						$scope.recentVideos.push(res.items[i]);
					}
				}

				$scope.recentLoading = false;
			});
			
		}

		function checkShow(){
			var title = $scope.video.snippet.title;

			if(title.indexOf('Grumpcade') >= 0){
				s('header').addClass('grumpcade');
			} else if(title.indexOf('Steam Train') >= 0){
				s('header').addClass('steam-train');
			} else if(title.indexOf('Table Flip') >= 0){
				s('header').addClass('table-flip');
			} else {
				s('header').removeClass();
			}
		}

	})

	.filter('unsafe', function($sce) {

		return function(val) {

			return $sce.trustAsHtml(val);

		};

	});

