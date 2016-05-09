angular.module('MasteryGraphs').controller('DataController', function($scope, ChampionService){

	var DataController = this;

	$scope.ctrl = DataController;
	DataController.labels = ["Mastery Level One", "Mastery Level Two", "Mastery Level Three", 
			"Mastery Level Four", "Mastery Level Five"]
	DataController.series = ["Series One"]

	DataController.graphData = [];
	DataController.isReady = false;

	DataController.searchText = "Enter Text";
	DataController.image = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg"
	DataController.prevImage = DataController.image;


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

	$scope.$watch('ctrl.currentChampionName', function(newValue, oldValue){
		if(DataController.staticData){
			DataController.currentChampion = DataController.staticData.find(function(obj){
				return obj.name == newValue;
			})
			DataController.prevImage = DataController.image;
			DataController.image = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + DataController.currentChampion.name + "_0.jpg"
			DataController.ChangeChampion();
		}
		
	})

	$scope.$watch('ctrl.graphData', function(newValue, oldValue){
		DataController.leagueAverage = DataController.graphData[0][0]
	})

	init();
});

angular.module('MasteryGraphs').directive("imageChange", function ($timeout) {
    return {
        restrict: "A",
        scope: {},
        link: function (scope, element, attrs) {
        	console.log(element);
        	console.log(attrs);
            element.on("load", function () {
                $timeout(function () {
                    element.removeClass("ng-hide-fade");
                    element.addClass("ng-show");
                }, 500);
            });
            attrs.$observe("ngSrc", function () {
               element.removeClass("ng-show");
                element.addClass("ng-hide-fade");
            });
        }
    }
});