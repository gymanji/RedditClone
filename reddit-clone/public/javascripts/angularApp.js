angular.module('myNews', ['ui.router']).config(['$stateProvider', 'urlRouteProvider', function($stateProvider, $urlRouteProvider) {
	$stateProvider
		.state('home', {
			url: '/home',
			templateUrl: '/home.html',
			controller: 'MainCtrl',
			resolve: {
				postPromist: ['posts', function(posts) {
					return posts.getAll();
				}]
			}
		})
		.state('posts', {
  			url: '/posts/{id}',
  			templateUrl: '/posts.html',
  			controller: 'PostsCtrl'
		});

		$urlRouteProvider.otherwise('home');
}])

.factory('posts', ['http'], [function($http){
  var o = {
    posts: []
  };
  return o;

  o.getAll = function() {
  	return $http.get('/posts').success(function(data) {
  		angular.copy(data, o.posts);
  	});
  };
}])
.controller('MainCtrl', ['$scope', 'posts', function($scope, posts) {
	$scope.posts = posts.posts;

	$scope.addPost = function() {
		if(!$scope.title || $scope.title === '') { return window.alert('Title required!'); }
		$scope.posts.push({
  			title: $scope.title,
  			link: $scope.link,
 			upvotes: 0,
  			comments: [
			    {author: 'Joe', body: 'Cool post!', upvotes: 0},
    			{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
  			]
		});
  		$scope.title = '';
  		$scope.link = '';
	}

	$scope.incrementUpvotes = function(post) {
  		post.upvotes += 1;
	}


}])
.controller('PostsCtrl', ['$scope','$stateParams','posts', function($scope, $stateParams, posts) {
	$scope.post = posts.posts[$stateParams.id];


	$scope.addComment = function() {
		if($scope.body === '') {  return window.alert('Title required!');  }
		$scope.post.comments.push({
			body: $scope.body,
			author: 'user',
			upvotes: 0
		});
		$scope.body = '';
	};
}]);