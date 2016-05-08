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
		otherwise({
			redirectTo:'/graphs'
		});

	}])