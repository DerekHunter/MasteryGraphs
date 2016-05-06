angular.module('MasteryGraphs').controller('DataController', function($scope, ChampionService){

	var DataController = this;

	$scope.staticData = ChampionService.staticChampionData;
	$scope.leagues = ChampionService.leagues;

	$scope.currentChampion = ChampionService.staticChampionData[0]
	$scope.currentLeague = ChampionService.leagues[3];
	$scope.graphData = [];
	$scope.searchText = ""


	$scope.init = function(){
		ChampionService.GetStaticChampionData();
		$scope.staticData = ChampionService.staticChampionData;
		ChampionService.GetChampionData($scope.currentChampion, $scope.currentLeague);
		$scope.graphData =  ChampionService.graphData;
	}

	$scope.ChangeChampion = function(){
		ChampionService.GetChampionData($scope.currentChampion, $scope.currentLeague);
		$scope.graphData =  ChampionService.graphData;
	}

	$scope.ChangeLeague = function(){
		ChampionService.SetGraphData($scope.currentLeague);
		$scope.graphData =  ChampionService.graphData;
	}

	$scope.$watch('currentLeague', function(newValue, oldValue){
		$scope.ChangeLeague();
		console.log($scope.graphData);
	})

});