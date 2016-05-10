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
		if(DataController.graphData[0].length !=0){
			pts = DataController.graphData[0].reduce(function(prev, cur, ci, arr){
				return prev+(ci+1)*cur;
			})
			cnt = DataController.graphData[0].reduce(function(prev, cur, ci, arr){
				return prev+cur;
			})
			if(cnt == 0){
				DataController.leagueAverage = 0
			}else{
				DataController.leagueAverage = Math.round((pts / cnt)*100)/100	
			}		

			cnt = 0;
			pts = 0;
			for(x = 0; x < ChampionService.data.length; x++){
				pts += ChampionService.data[x].championLevel*ChampionService.data[x].count;
				cnt += ChampionService.data[x].count;
			}

			DataController.regionAverage = Math.round((pts / cnt)*100)/100
		}
		
	})

	init();
});

angular.module('MasteryGraphs').directive("imageChange", function ($timeout) {
    return {
        restrict: "A",
        scope: {},
        link: function (scope, element, attrs) {
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