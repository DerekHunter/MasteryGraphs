
var request = require('sync-request');
var fs = require('fs');

var apiKey = JSON.parse(fs.readFileSync('../config.txt', 'utf8')).key;
if (apiKey == ''){
	console.log("Not a valid api key");
}

featuredGame = JSON.parse(request('GET', "https://na.api.pvp.net/observer-mode/rest/featured?api_key="+apiKey).body);
for(var gameIndex = 0; gameIndex < featuredGame.gameList.length; gameIndex++){
	for(var participantsIndex = 0; participantsIndex < featuredGame.gameList[gameIndex].participants.length; participantsIndex++){
		request('POST', "http://192.168.1.138:3000/api/summoner", {
			json:{
				"summonerName":featuredGame.gameList[gameIndex].participants[participantsIndex].summonerName,
				"region":"na"
			}
		})
	}
}

for(var x = 0; x < 100; x++){
	summoner = JSON.parse(request('GET', "http://192.168.1.138:3000/api/next/crawl/region/na").body);
	console.log(summoner);
}

	// summoner = JSON.parse(request('GET', "http://192.168.1.138:3000/api/next/crawl/region/na").body);
