angular.module('MasteryGraphs').controller('RecommenderController', function($scope, RecommenderService){


	var RecommenderController = this;
	$scope.ctrl = RecommenderController;


	RecommenderService.GetChampionData(function(){
		RecommenderController.staticData = RecommenderService.staticChampionData;
		RecommenderController.currentChampion = RecommenderService.staticChampionData[0]
		RecommenderController.currentChampionId = RecommenderService.staticChampionData[0].id;
		RecommenderController.currentChampionName = RecommenderService.staticChampionData[0].name;
		RecommenderController.icon = "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/Aatrox.png";
		RecommenderController.image = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg";
	});

	RecommenderService.GetRecommenderData(1, function(){
		console.log(RecommenderService.recommenderData);
	})


	$scope.$watch('ctrl.currentChampionName', function(newValue, oldValue){
		if(RecommenderController.staticData){
			RecommenderController.currentChampion = RecommenderController.staticData.find(function(obj){
				return obj.name == newValue;
			})
			RecommenderService.GetRecommenderData(RecommenderController.currentChampion.id, function(){
				RecommenderController.prevImage = RecommenderController.image;
				RecommenderController.image = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + RecommenderController.currentChampion.name + "_0.jpg"
				RecommenderController.icon = "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/"+RecommenderController.currentChampion.name+".png"
				RecommenderController.reconChamps = [];

				for(x = 1; x < 4; x++){
					RecommenderController.reconChamps.push(RecommenderController.currentChampion = RecommenderController.staticData.find(function(obj){
						return obj.id == RecommenderService.recommenderData[x].champId;
					}))
					RecommenderController.reconChamps[x-1].icon = "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/"+RecommenderController.reconChamps[x-1].name+".png"
				}

				console.log(RecommenderController.reconChamps);
			})
		}
		
	})




});
