angular.module('videoCtrl', [])

	.controller('videoController', function($http, $scope, $location, $sce){


		var video_id = $location.path().substr(8,$location.path().length - 1);

		$http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet%2cstatistics&id=' + video_id + '&key=' + $scope.settings.api_key)

			.success(function(res){

				$scope.video = res.items[0];

				//video setup
				$scope.video_id = video_id;
				$scope.playerHeight = 480;
				$scope.playerWidth = 854;
				$scope.playerVars = {
					'showinfo': 0,
					'autoplay': 0
				};

				// console.log($scope.video);

				//Give a formatted date for the view
				setPublishAtDate();

				//Formats Description
				preserveDescription();

				//Sidebar loading
				$scope.recentLoading = true;
				$scope.nextLoading = true;
				sideBar();

				$scope.$on('youtube.player.ended', function($event, player){
					$location.path('/videos/' + $scope.nextVideo.id.videoId);
				});


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
				$scope.autoplay = s('.toggle').hasClass('active')[0];
				setCookie('gamegrumpsAutoplay',$scope.autoplay,2);

				//set toggle
				s('.toggle').on('click', function(e){
					if(s(this).hasClass('active')[0]){
						s(this).removeClass('active');
					} else {
						s(this).addClass('active');
					}

					$scope.autoplay = s(this).hasClass('active')[0];

					setCookie('gamegrumpsAutoplay',$scope.autoplay,2);

					
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

		function numberWithCommas(x) {
			return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
		}

		function sideBar(){
			$http.get('https://www.googleapis.com/youtube/v3/channels?part=contentDetails&forUsername=' + $scope.settings.channel + '&key=' + $scope.settings.api_key)
			.success(function(res){
				$scope.channelId = res.items[0].id;
				$scope.uploadPlaylist = res.items[0].contentDetails.relatedPlaylists.uploads;

				getVideos();
				getNextVideo();
			});
		}

		function getVideos(){

			$scope.recentLoading = true;
			
			$http.get('https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=' + $scope.uploadPlaylist +'&maxResults=5&key=' + $scope.settings.api_key)
				.success(function(res){
					$scope.recentVideos = [];
					$scope.nextToken = res.nextPageToken;

					for(var i = 0; i < res.items.length; i++){
						$scope.recentVideos.push(res.items[i]);
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

		function getNextVideo(){
			$http.get('https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=' + $location.path().substr(8,$location.path().length - 1) +'&type=video&key=' + $scope.settings.api_key)

				.success(function(res){
					console.log(res);
					$scope.nextVideo = res.items[0];
					console.log($scope.nextVideo);
					$scope.nextLoading = false;
				});
		}

	})

	.filter('unsafe', function($sce) {

		return function(val) {

			return $sce.trustAsHtml(val);

		};

	});

	function setCookie(cname, cvalue, exdays) {
		var d = new Date();
		d.setTime(d.getTime() + (exdays*24*60*60*1000));
		var expires = "expires="+d.toUTCString();
		document.cookie = cname + "=" + cvalue + "; " + expires;
	}

