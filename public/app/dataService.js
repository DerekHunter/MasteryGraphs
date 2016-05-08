angular.module('MasteryGraphs').factory('ChampionService', function($http){

	ChampionService = {}
	ChampionService.staticChampionData = [];
	ChampionService.loaded = false;
	ChampionService.leagues = ["UNRANKED", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "CHALLENGER"];
	ChampionService.data = [];
	ChampionService.graphData;

	ChampionService.isLoaded = function(){
		return ChampionService.loaded;
	}

	ChampionService.GetStaticChampionData = function(callback){
		$http({
			method: 'GET',
			url: '/api/champions'
		}).then(function successCallback(response) {
			ChampionService.staticChampionData = response.data.sort(function(a,b){
				if(a.name < b.name) return -1
				if(a.name > b.name) return 1
				return 0;
			});
			ChampionService.loaded = true;
			callback();
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	ChampionService.GetChampionData = function(champion, league, callback){
		if(champion){
			$http({
				method: 'GET',
				url: '/api/champion/' + champion.id
			}).then(function successCallback(response) {
				ChampionService.data = response.data
				ChampionService.SetGraphData(league);
				callback();
			}, function errorCallback(response) {
				console.log(response);
			});
		}
	};

	ChampionService.SetGraphData = function(league){
		ChampionService.graphData = [ChampionService.data.filter(function(value){
			return league == value.league
		}).sort(function(a,b){
			if(a.championLevel < b.championLevel) return -1;
			if(a.championLevel > b.championLevel) return 1;
			return 0;
		}).map(function(champion){
			return champion.count;
		})]
		console.log(ChampionService.graphData);

	}



	return ChampionService;
	

})