var request = require('sync-request');
var fs = require('fs');
var sleep = require('sleep');

var apiKey = JSON.parse(fs.readFileSync('../config.txt', 'utf8')).key;
if (apiKey == ''){
	console.log("Not a valid api key");
}




for(var x = 0; x < 100; x++){
	summoner = JSON.parse(request('GET', "http://192.168.1.138:3000/api/next/crawl/region/na").body);
	if(summoner != null){
		if(!summoner.processed){
			sleep.usleep(500000);
			console.log("Processing " + summoner.summonerName);
			request('POST', "http://192.168.1.138:3000/api/process", {
			json:{
				"summonerName":summoner.summonerName,
				"region":summoner.region
			}
		})
		}
	}
}