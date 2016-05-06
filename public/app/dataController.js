angular.module('MasteryGraphs').controller('DataController', function($scope, ChampionService){

	var DataController = this;
	DataController.message = "Controller Message!";
	$scope.message = ChampionService.message;
	$scope.messageTwo = DataController.message;


});