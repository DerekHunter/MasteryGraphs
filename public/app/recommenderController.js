angular.module('MasteryGraphs').controller('RecommenderController', function($scope, RecommenderService){


	var RecommenderController = this;
	$scope.ctrl = RecommenderController;
	blackList = [3,136,83,6, 420, 30, 44, 36, 38, 85, 50, 20, 96, 72, 110, 113, 115, 45, 13, 14, 127, 57, 33, 68, 134, 69,
	61, 102, 29, 48, 223, 101, 42, 98, 56];

	RecommenderService.GetChampionData(function(){
		RecommenderController.staticData = RecommenderService.staticChampionData;
		RecommenderController.currentChampion = RecommenderService.staticChampionData[0]
		RecommenderController.currentChampionId = RecommenderService.staticChampionData[0].id;
		RecommenderController.currentChampionName = RecommenderService.staticChampionData[0].name;
		RecommenderController.icon = "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/Aatrox.png";
		RecommenderController.image = "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/Aatrox_0.jpg";
	});

	RecommenderService.GetRecommenderData(1, function(){
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

				x = 1;
				while(RecommenderController.reconChamps.length < 3 && x < RecommenderService.recommenderData.length){
					if(blackList.find(function(obj){
						return obj == RecommenderService.recommenderData[x].champId;
					})){
						x++;
						continue;
					}

					RecommenderController.reconChamps.push(RecommenderController.currentChampion = RecommenderController.staticData.find(function(obj){
						return obj.id == RecommenderService.recommenderData[x].champId;
					}))
					RecommenderController.reconChamps[RecommenderController.reconChamps.length-1].icon = "http://ddragon.leagueoflegends.com/cdn/6.9.1/img/champion/"+RecommenderController.reconChamps[RecommenderController.reconChamps.length-1].name+".png"
					x++;
				}
			})
		}
		
	})




});
