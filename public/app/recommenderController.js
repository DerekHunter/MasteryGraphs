angular.module('MasteryGraphs').controller('RecommenderController', function($scope, RecommenderService){


	var RecommenderController = this;
	$scope.ctrl = RecommenderController;


	RecommenderService.GetChampionData(function(){

	});

	RecommenderService.GetRecommenderData(1, function(){
		console.log(RecommenderService.recommenderData);
	})





});
