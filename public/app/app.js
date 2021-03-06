app = angular.module('MasteryGraphs', [
	"chart.js",
	"ngRoute"
]);

app.config(['$routeProvider',
	function($routeProvider){
		$routeProvider.
		when('/graphs', {
			templateUrl: 'app/partials/graphs.html',
			controller: 'DataController'
		}).
		when('/recommender', {
			templateUrl: 'app/partials/recommender.html',
			controller: 'RecommenderController'
		}).
		when('/faq', {
			templateUrl: 'app/partials/faq.html'
		}).
		otherwise({
			redirectTo:'/recommender'
		});

	}])