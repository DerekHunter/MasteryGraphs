var request = require('sync-request');
var fs = require('fs');

var apiKey = JSON.parse(fs.readFileSync('../config.txt', 'utf8')).key;
if (apiKey == ''){
	console.log("Not a valid api key");
}

summoner = JSON.parse(request('GET', "http://localhost:3000/api/next/process").body);
while(summoner !=null){
	if(!summoner.processed){
		console.log("Processing " + summoner.summonerName);
		request('POST', "http://localhost:3000/api/process", {
			json:{
				"summonerName":summoner.summonerName,
			}
		})
	}
	summoner = JSON.parse(request('GET', "http://localhost:3000/api/next/process").body);
}