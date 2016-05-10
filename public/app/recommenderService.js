angular.module('MasteryGraphs').factory('RecommenderService', function($http){
	
	RecommenderService = {}

	RecommenderService.recommenderData = [];

	RecommenderService.GetChampionData = function(callback){
		$http({
			method: 'GET',
			url: '/api/champions'
		}).then(function successCallback(response) {
			RecommenderService.staticChampionData = response.data.sort(function(a,b){
				if(a.name < b.name) return -1
				if(a.name > b.name) return 1
				return 0;
			});
			RecommenderService.loaded = true;
			callback();
		}, function errorCallback(response) {
			console.log(response);
		});
	}


	RecommenderService.GetRecommenderData = function(championId, callback){
		if(championId){
			$http({
				method: 'GET',
				url: '/api/recommender/champion/'+championId
			}).then(function successCallback(response) {
				RecommenderService.recommenderData = response.data[0].data.sort(function(a,b){
				if(a.similarity < b.similarity) return -1
				if(a.similarity > b.similarity) return 1
				return 0;
			});
				callback();
			}, function errorCallback(response) {
				console.log(response);
			});
		}
		
	}

	return RecommenderService;

});