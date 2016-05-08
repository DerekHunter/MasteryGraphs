
var request = require('sync-request');
var fs = require('fs');

var apiKey = JSON.parse(fs.readFileSync('../config.txt', 'utf8')).key;
if (apiKey == ''){
	console.log("Not a valid api key");
}

championData = JSON.parse(request('GET', "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?api_key="+apiKey).body).data;
ids = []
for(var champion in championData){
	if(championData.hasOwnProperty(champion)){
		ids.push({id:parseInt(championData[champion].id)})
	}
}
ids = ids.sort(function(a,b){
	if (a.id < b.id) return -1;
	if (a.id > b.id) return 1;
	return 0;
}).map(function(obj){return obj.id}).join(",");
fs.appendFileSync('data/masteryData.txt', ids+'\n');

processed = 0

summoners = []
featuredGame = JSON.parse(request('GET', "https://na.api.pvp.net/observer-mode/rest/featured?api_key="+apiKey).body);
for(var gameIndex = 0; gameIndex < featuredGame.gameList.length; gameIndex++){
	for(var participantsIndex = 0; participantsIndex < featuredGame.gameList[gameIndex].participants.length; participantsIndex++){
		summoners.push(featuredGame.gameList[gameIndex].participants[participantsIndex].summonerName.toLowerCase().replace(/ /g,''))
	}
}

x=0;
while(x < summoners.length && processed < 10000){
	console.log("Processed; "+processed);
	try{
		summonerName = summoners[x];
		console.log(summonerName);
		id = JSON.parse(request('GET', 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + summonerName + '?api_key=' + apiKey).body)[summonerName].id;
		masteryData = JSON.parse(request('GET', 'https://na.api.pvp.net/championmastery/location/NA1/player/'+id+'/champions?api_key='+apiKey).body)
		outputData = []
		for (var champion in championData) {
			if (championData.hasOwnProperty(champion)) {
				championMastery = masteryData.find(function(obj){
					return obj.championId == championData[champion].id
				})
				if(championMastery){
					mastery = championMastery.championPoints
				}else{
					mastery = 0
				}
				championId = championData[champion].id
				outputData.push({id:championData[champion].id, mastery:mastery})
			}
		}
		data = outputData.sort(function(a,b){
			if (a.id < b.id) return -1;
			if (a.id > b.id) return 1;
			return 0;
		}).map(function(obj){return obj.mastery}).join(',');

		fs.appendFileSync('data/masteryData.txt', data+'\n');
		processed++;
		matchHistory = JSON.parse(request('GET', "https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + id + "?api_key="+apiKey).body)['matches']	
		for(var gameCnt = 0; gameCnt < 5; gameCnt++){
			matchData = JSON.parse(request('GET', "https://na.api.pvp.net/api/lol/na/v2.2/match/"+matchHistory[gameCnt].matchId+"?api_key="+apiKey).body)
			for(var participantsIndex = 0; participantsIndex < matchData.participantIdentities.length; participantsIndex++){
				if(!summoners.find(function(obj){
					return obj == matchData.participantIdentities[participantsIndex].player.summonerName.toLowerCase().replace(/ /g,'')
				})){
					summoners.push(matchData.participantIdentities[participantsIndex].player.summonerName.toLowerCase().replace(/ /g,''))
				}
			}
		}
	}catch(err){
		console.log(err);
	}
	x++;
}