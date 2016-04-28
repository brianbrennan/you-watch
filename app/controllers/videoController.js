(function(){
angular.module('videoCtrl', [])

	.controller('videoController', videoController)

	.filter('unsafe', unsafeFilter);


function videoController($http, $scope, $location, $sce, $rootScope){

	var vm = this;

	var video_id = $location.path().substr(8,$location.path().length - 1);

	$http.get('https://www.googleapis.com/youtube/v3/videos?part=snippet%2cstatistics&id=' + video_id + '&key=' + $scope.settings.api_key)

		.success(function(res){

			
			//all video information
			vm.video = res.items[0];

			//Make sure that the youtube id is valid, compared to channel ID in settings
			//Must be before other member declarations but AFTER the video declaration
			vm.checkPage();

			//video setup
			vm.autoplay = getCookie('gamegrumpsAutoplay') === 'true' ? 1 : 0;

			vm.video_id = video_id;
			vm.playerHeight = 480;
			vm.playerWidth = 854;
			vm.playerVars = {
				'showinfo': 0,
				'autoplay': vm.autoplay
			};

			/*Formatting for the numbers on the page to be more easily legible to humans*/
			vm.video.statistics.viewCount = vm.numberWithCommas(vm.video.statistics.viewCount);
			vm.video.statistics.likeCount = vm.numberWithCommas(vm.video.statistics.likeCount);
			vm.video.statistics.dislikeCount = vm.numberWithCommas(vm.video.statistics.dislikeCount);

			//Sidebar loading
			vm.recentLoading = true;
			vm.nextLoading = true;

			//Give a formatted date for the view
			vm.setPublishAtDate();

			//Formats Description
			vm.preserveDescription();

			//sets up autoplay on video ending
			vm.setAutoplay();

			//set up the infoBox under the video player
			vm.infoBox();

			//update header
			vm.checkShow();

			//configure theatre mode (calls to check if in theatre mode inside function)
			vm.theatreToggle();

			//configure user
			vm.getUser();

			//configure rating
			vm.configRating();

			//configure comments
			vm.configComments();

			//configure fullScreen Mode to continue being fullscreen during autoplay mode(currently not working yet)
			vm.configFullscreen();

		});


	vm.checkPage = function(){

		$rootScope.pageTitle = vm.video.snippet.title;

		if(typeof vm.video == 'undefined' || vm.video.snippet.channelId != $rootScope.settings.channelId)
			$location.path('/404');
	}


	vm.setPublishAtDate = function(){
		var date = new Date(vm.video.snippet.publishedAt);

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

		vm.video.snippet.publishedAt = formattedDate;
	};


	vm.preserveDescription = function(){
		var description = vm.video.snippet.description;

		description = vm.preserveLinks(description);

		description = description.replace(/\n/g, "<br>");

		vm.video.snippet.description = description;
	};


	vm.preserveLinks = function(d){
		d = d.replace( /(http:\/\/[^\s]+)/gi , '<a href="$1">$1</a>' );
		d = d.replace( /(https:\/\/[^\s]+)/gi , '<a href="$1">$1</a>' );

		return d;
	}


	vm.numberWithCommas = function(x){
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};


	vm.checkShow = function(){
		var title = vm.video.snippet.title;

		if(title.indexOf('Grumpcade') >= 0){
			s('header').addClass('grumpcade');
		} else if(title.indexOf('Steam Train') >= 0){
			s('header').addClass('steam-train');
		} else if(title.indexOf('Table Flip') >= 0){
			s('header').addClass('table-flip');
		} else {
			s('header').removeClass();
		}
	};


	vm.setAutoplay = function(){
		/*
		$scope is required here because the event is triggered 
		by the youtube player in the view, which I have little 
		control over without a lot of overhaul
		*/
		$scope.$on('youtube.player.ended', function($event, player){
			if(vm.autoplay === 1)
				$location.path('/videos/' + vm.nextVideo.id.videoId);
		});

		//configure autoplay toggle
		if(vm.autoplay === 1){
			s('.toggle').addClass('active');
		}

		s('.toggle').on('click', function(e){
			if(s(this).hasClass('active')[0]){
				s(this).removeClass('active');
				$rootScope.setCookie('gamegrumpsAutoplay',false,2);

			} else {
				s(this).addClass('active');
				setCookie('gamegrumpsAutoplay',true,2);
				$scope.$on('youtube.player.ended', function($event, player){
					if($rootScope.getCookie('gamegrumpsAutoplay') == 'true')
						$location.path('/videos/' + vm.nextVideo.id.videoId);
				});
			}
			
		});
	};


	vm.infoBox = function(){
		s('.show-hide').on('click', function(){
			if(s('.description').hasClass('full')[0]){
				s('.description').removeClass('full');
				s(this).innerHtml('Show More');
			} else {
				s('.description').addClass('full');
				s(this).innerHtml('Hide');
			}
		});


		var likes = Number(vm.video.statistics.likeCount);
		var total = Number(vm.video.statistics.dislikeCount) + likes;

		likeRatio = likes / total * 100;

		s('.like-bar').css('width', String(likeRatio + '%'));
	};


	vm.configComments = function(){

		var loadedComments = true;

		document.addEventListener('scroll', function(){
			if(document.getElementsByTagName('body')[0].scrollTop > 240 && loadedComments){
				vm.getComments();


				loadedComments = false;
			}
		});
	};


	vm.getComments =  function(){
		vm.commentsLoading = true;
		$http.get('https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=' + video_id + '&order=relevance&maxResults=5&key=' + $scope.settings.api_key)
			.success(function(res){
				vm.nextCommentPageToken = res.nextPageToken;
				vm.comments = res.items;
				vm.commentsLoading = false;
			});
	};


	vm.getReplies = function(i){
		vm.comments[i].repliesLoadingMore = true;

		if(vm.comments[i].replies){
			
			if(vm.comments[i].replies.nextPageToken){
				$http.get('https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=' + vm.comments[i].id + '&order=relevance&maxResults=5&pageToken=' + vm.comments[i].replies.nextPageToken + '&key=' + $rootScope.settings.api_key)

				.success(function(res){
					console.log(res);
					for(var j = 0; j < res.items.length; j++)
						vm.comments[i].replies.items.push(res.items[j]);
					vm.comments[i].replies.nextPageToken = res.nextPageToken;
					console.log(vm.comments[i]);
					vm.comments[i].repliesLoadingMore = false;
				});
			}
		} else {
			$http.get('https://www.googleapis.com/youtube/v3/comments?part=snippet&parentId=' + vm.comments[i].id + '&order=relevance&maxResults=5&key=' + $rootScope.settings.api_key).

			success(function(res){
				vm.comments[i].replies = res;
				console.log(vm.comments[i]);
				vm.comments[i].repliesLoadingMore = false;
			});
		}
	};


	vm.getMoreComments = function(){
		vm.moreCommentsLoading = true;
		console.log(vm.nextCommentPageToken);
		$http.get('https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=' + video_id + '&order=relevance&maxResults=5&pageToken=' + vm.nextCommentPageToken + '&key=' + $rootScope.settings.api_key)
			.success(function(res){
				vm.nextCommentPageToken = res.nextPageToken;
				for(var i = 0; i < res.items.length; i++)
					vm.comments.push(res.items[i]);


				
				vm.moreCommentsLoading = false;
			});
	};


	vm.convertTime = function(time){
		var now = new Date;
		var time = new Date(time);

		return time.getFullYear;
	};


	vm.theatreToggle = function(){
		if(getCookie('gamegrumpsTheatreMode') === 'true'){
			vm.theatreMode(false);
			s('.theatre').addClass('active');
		}

		s('.theatre').on('click', function(e){
			if(s(this).hasClass('active')[0]){
				vm.theatreMode(true);
				s(this).removeClass('active');
			} else {
				vm.theatreMode(false);
				s(this).addClass('active');
			}
		});
	};


	vm.theatreMode = function(b){
		if(b){
			setCookie('gamegrumpsTheatreMode', 'false', 2);
			s('#player').css('width','854px');
			s('#player').css('height','480px');
			s('.right').removeClass('theatreDown');
		} else {
			setCookie('gamegrumpsTheatreMode', 'true', 2);
			s('.right').addClass('theatreDown');
			window.setTimeout(function(){
				s('#player').css('width','1160px');
				s('#player').css('height','652px');
			},300);
		}
	};


	vm.getUser = function(){
		if($rootScope.isAuth()){
			$http.get('https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true&key=' + $rootScope.settings.api_key + '&access_token=' + $rootScope.getCookie('ggAuthentication'))

				.success(function(res){
					vm.user = res.items[0];
					console.log(res);
				});
		}
	};


	vm.configRating = function(){
		s('.vid-info .thumb').on('click', function(e){
			if(s(this).hasClass('active')[0])
				s(this).removeClass('active');
			else{
				s('.vid-info .thumb').removeClass('active');
				s(this).addClass('active');
			}
		});
	};


	var vidRated = false;

	vm.rate = function(i){
		$rootScope.checkAuth();

		if($rootScope.isAuth()){

			var rating;


			if(vidRated){
				rating = 'none';
				vidRated = false;
			} else {
				if(i == 1){
					rating = 'like';
					vidRated = true;
				}
				else if(i == 0){
					rating = 'dislike';
					vidRated = true;
				}
			}

			$http.post('https://www.googleapis.com/youtube/v3/videos/rate?id=' + video_id + '&rating=' + rating + '&key=' + $rootScope.settings.api_key + '&access_token=' + $rootScope.getCookie('ggAuthentication'));
		}
	};



	vm.newComment = function(){
		$rootScope.checkAuth();

		if($rootScope.isAuth()){
			
			var data = {
				"snippet": {
					"videoId": video_id,
					"channelId": vm.user.channelId,
					"topLevelComment": {
						"snippet": {
							textOriginal: vm.postingComment
						}
					}
				}
			}

			data.snippet.topLevelComment.snippet.textDisplay = data.snippet.topLevelComment.snippet.textOriginal;
			console.log(data);
			$http.post('https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=' + video_id +'&key=' + $rootScope.settings.api_key + '&access_token=' + $rootScope.getCookie('ggAuthentication'), data)

				.success(function(res){
					if(!$scope.comments)
						getComments();
					$scope.comments.unshift(res);
					$scope.postingComment = '';
				});


		}
	};

	/*
		Haven't gotten around to getting this to work yet
	*/
	vm.newReply = function(p){
		$rootScope.checkAuth();

		if($rootScope.isAuth()){
			var snippet = {};

			snippet.textOriginal = $scope.postingReply;
			snippet.parentId = p;

			
		}
	};

	/*
		Fullscreen current working as stated in a comment above
	*/
	vm.configFullscreen = function(){
		/*
		this currently isn't working but is supposed to 
		keep the user in fullscreen mode even when 
		the video autoplays
		*/
		s('.ytp-fullscreen-button').on('click', function(){
			
			if(!$rootScope.getCookie('fullScreenMode') || !$rootScope.getCookie('fullScreenMode') == 'false'){
				vm.fullScreen(true);
			} else {
				vm.fullScreen(true);
			}
		});
	}

	vm.fullScreen = function(d){
		if(d){
			$rootScope.setCookie('fullscreenMode','true');
		} else {
			$rootScope.setCookie('fullscreenMode','false');
		}
	};
}

//Function for Filter 'Unsafe'
function unsafeFilter($sce){
	return function(val) {

		return $sce.trustAsHtml(val);

	};
}



function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+d.toUTCString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return false;
}

})();

