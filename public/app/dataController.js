angular.module('MasteryGraphs').controller('DataController', function($scope, ChampionService){

	var DataController = this;

	$scope.staticData = ChampionService.staticChampionData;
	$scope.leagues = ChampionService.leagues;

	$scope.currentChampion = ChampionService.staticChampionData[0]
	$scope.currentLeague = ChampionService.leagues[3];
	$scope.searchText = ""


	$scope.init = function(){
		ChampionService.GetStaticChampionData();
		$scope.staticData = ChampionService.staticChampionData;
		ChampionService.GetChampionData($scope.currentChampion, $scope.currentLeague);
		$scope.data =  ChampionService.graphData;
	}

	$scope.ChangeChampion = function(){
		$scope.currentChampion = 2;
		ChampionService.GetChampionData($scope.currentChampion, $scope.currentLeague);
		$scope.data =  ChampionService.graphData;
	}

	$scope.ChangeLeague = function(){
		$scope.currentLeague = ChampionService.leagues[5]
		ChampionService.SetGraphData($scope.currentLeague);
		$scope.data =  ChampionService.graphData;
	}

	$scope.getMatches = function(text){
		
	}

});