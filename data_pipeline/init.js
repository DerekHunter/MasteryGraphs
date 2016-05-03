
var request = require('sync-request');
var fs = require('fs');

var db = require('monk')('localhost:27017/data');
champCollection = db.get('champions');


var apiKey = JSON.parse(fs.readFileSync('../config.txt', 'utf8')).key;
console.log(apiKey)
if (apiKey == ''){
	console.log("Not a valid api key");
}

regions = [ "eune", "euw", "na", "oce"]
leagues = ["UNRANKED", "BRONZE", "SILVER", "GOLD", "PLATINUM", "DIAMOND", "MASTER", "CHALLENGER"]
levels = ["LevelOne", "LevelTwo", "LevelThree", "LevelFour", "LevelFive"]

championData = JSON.parse(request('GET', "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key="+apiKey).body).data;
console.log("Inserting...");
for(regionIndex = 0; regionIndex < regions.length; regionIndex++){
	for(leagueIndex = 0; leagueIndex < leagues.length; leagueIndex++){
		for(levelIndex = 0; levelIndex < levels.length; levelIndex++){
			for (var champion in championData) {
				if (championData.hasOwnProperty(champion)) {
					championObject = {}
					championObject.name = championData[champion].key;
					championObject.championId = championData[champion].id;
					championObject.region = regions[regionIndex];
					championObject.leagues = leagues[leagueIndex];
					championObject.level = levels[levelIndex];
					InsertChampionIntoDb(championObject);
				}
			}
		}
	}
}



function InsertChampionIntoDb(champion){
	console.log(champion);
	champCollection.insert(champion, function(err, docs){
		if(err !=null) console.log(err);
	})
}