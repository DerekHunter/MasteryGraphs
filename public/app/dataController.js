angular.module('MasteryGraphs').controller('DataController', function($scope, ChampionService){

	var DataController = this;

	$scope.ctrl = DataController;
	DataController.labels = ["Mastery Level One", "Mastery Level Two", "Mastery Level Three", 
			"Mastery Level Four", "Mastery Level Five"]
	DataController.series = ["Series One"]

	DataController.graphData = [];
	DataController.isReady = false;

	DataController.searchText = "Enter Text";


	init = function(){
		ChampionService.GetStaticChampionData(function(){
			DataController.staticData = ChampionService.staticChampionData;
			DataController.leagues = ChampionService.leagues;
			DataController.currentChampion = ChampionService.staticChampionData[0]
			DataController.currentChampionId = ChampionService.staticChampionData[0].id;
			DataController.currentChampionName = ChampionService.staticChampionData[0].name;
			DataController.currentLeague = ChampionService.leagues[3];
			ChampionService.GetChampionData(DataController.currentChampion, DataController.currentLeague, function(){
				DataController.graphData = ChampionService.graphData;
				DataController.isReady = true;
			});
		});	
		DataController.graphData =  ChampionService.graphData;
	}

	DataController.ChangeChampion = function(){
		ChampionService.GetChampionData(DataController.currentChampion, DataController.currentLeague, function(){
			DataController.graphData = ChampionService.graphData;
		});
		DataController.graphData =  ChampionService.graphData;
	}

	DataController.ChangeLeague = function(){
		ChampionService.SetGraphData(DataController.currentLeague);
		DataController.graphData =  ChampionService.graphData;  
	}

	$scope.$watch('ctrl.currentLeague', function(newValue, oldValue){
		DataController.ChangeLeague();
	})

	$scope.$watch('ctrl.currentChampionId', function(newValue, oldValue){
		if(DataController.staticData){
			console.log("EXISTS");
			DataController.currentChampion = DataController.staticData.find(function(obj){
				return obj.name == newValue;
			})
			DataController.ChangeChampion();
		}else{
			console.log("Doesn'tExist");
		}
		
	})

	init();
});