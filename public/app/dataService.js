angular.module('MasteryGraphs').factory('ChampionService', function($http){

	ChampionService = {}
	ChampionService.staticChampionData = [];
	ChampionService.isReady = false;
	ChampionService.leagues = ["UNRANKED", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "CHALLENGER"];
	ChampionService.data = [];
	ChampionService.graphData;


	ChampionService.GetStaticChampionData = function(){
		$http({
			method: 'GET',
			url: '/api/champions'
		}).then(function successCallback(response) {
			for(x = 0; x < response.data.length; x++){
				ChampionService.staticChampionData.push(response.data[x]);
			}
			console.log(ChampionService.staticChampionData)
			ChampionService.isReady = true;
		}, function errorCallback(response) {
			console.log(response);
		});
	}

	ChampionService.GetChampionData = function(championId, league){
		$http({
			method: 'GET',
			url: '/api/champion/' + championId
		}).then(function successCallback(response) {
			ChampionService.data = response.data
			ChampionService.SetGraphData(league);
		}, function errorCallback(response) {
			console.log(response);
		});
	};

	ChampionService.SetGraphData = function(league){
		ChampionService.graphData = ChampionService.data.filter(function(value){
			return league == value.league
		})
	}

	

	return ChampionService;
	

})