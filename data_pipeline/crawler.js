
var request = require('sync-request');
var fs = require('fs');

var apiKey = JSON.parse(fs.readFileSync('../config.txt', 'utf8')).key;
if (apiKey == ''){
	console.log("Not a valid api key");
}

regions = [ "eune", "euw", "na", "oce"]

console.log("Init");
for(regionIndex = 0; regionIndex < regions.length; regionIndex++){
	region = regions[regionIndex];
	console.log("Region: "+ region)
	featuredGame = JSON.parse(request('GET', "https://"+region+".api.pvp.net/observer-mode/rest/featured?api_key="+apiKey).body);
	for(var gameIndex = 0; gameIndex < featuredGame.gameList.length; gameIndex++){
		for(var participantsIndex = 0; participantsIndex < featuredGame.gameList[gameIndex].participants.length; participantsIndex++){
			console.log("Inserting " + featuredGame.gameList[gameIndex].participants[participantsIndex].summonerName)
			request('POST', "http://192.168.1.138:3000/api/summoner", {
				json:{
					"summonerName":featuredGame.gameList[gameIndex].participants[participantsIndex].summonerName.toLowerCase().replace(/ /g,''),
					"region":region
				}
			})
		}
	}
}

for(var x = 0; x < 10; x++){
	for(regionIndex = 0; regionIndex < regions.length; regionIndex++){
		region = regions[regionIndex]
		try{
			summoner = JSON.parse(request('GET', "http://192.168.1.138:3000/api/next/crawl/region/"+region).body);
			summonerName = summoner.summonerName.toLowerCase().replace(/ /g,'')
			console.log('https://'+region+'.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + summonerName + '?api_key=' + apiKey)
			id = JSON.parse(request('GET', 'https://'+region+'.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + summonerName + '?api_key=' + apiKey).body)[summonerName].id;
			matchHistory = JSON.parse(request('GET', "https://"+region+".api.pvp.net/api/lol/"+region+"/v2.2/matchlist/by-summoner/" + id + "?api_key="+apiKey).body)['matches']	
			for(var gameCnt = 0; gameCnt < 5; gameCnt++){
				matchData = JSON.parse(request('GET', "https://"+region+".api.pvp.net/api/lol/"+ region +"/v2.2/match/"+matchHistory[gameCnt].matchId+"?api_key="+apiKey).body)
				for(var participantsIndex = 0; participantsIndex < matchData.participantIdentities.length; participantsIndex++){
					console.log("Inserting " + matchData.participantIdentities[participantsIndex].player.summonerName)
					request('POST', "http://192.168.1.138:3000/api/summoner", {
						json:{
							"summonerName":matchData.participantIdentities[participantsIndex].player.summonerName.toLowerCase().replace(/ /g,''),
							"region":region
						}
					})
				}
			}
		}catch(err){

		}
		
	}
}
