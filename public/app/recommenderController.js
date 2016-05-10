angular.module('MasteryGraphs').controller('RecommenderController', function($scope, RecommenderService){


	var RecommenderController = this;
	$scope.ctrl = RecommenderController;


	RecommenderService.GetChampionData(function(){
		RecommenderController.staticData = RecommenderService.staticChampionData;
		RecommenderController.currentChampion = RecommenderService.staticChampionData[0]
		RecommenderController.currentChampionId = RecommenderService.staticChampionData[0].id;
		RecommenderController.currentChampionName = RecommenderService.staticChampionData[0].name;
		RecommenderController.image = "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/Aatrox.png "
	});

	RecommenderService.GetRecommenderData(1, function(){
		console.log(RecommenderService.recommenderData);
	})





});
