var express = require('express');
var https = require('https');
var fs = require('fs');
var db = require('monk')('localhost:27017/data');
var request = require('sync-request');
var app = express();
var router = express.Router();
 
var apiKey = JSON.parse(fs.readFileSync('config.txt', 'utf8')).key;
 if (apiKey == ''){
 	console.log("Not a valid api key");
 } 
 
champCollection = db.get('champions');
recCollection = db.get('recommender');
 
 
router.get('/username/:name/', function(req, res){
	var username = req.params.name.toLowerCase();
	id = JSON.parse(request('GET', 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + username + '?api_key=' + apiKey).body)[username].id;
	rank = JSON.parse(request('GET', 'https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/' + id + '?api_key='+apiKey).body)[id].filter(function(item){return item.queue == "RANKED_SOLO_5x5"})[0].tier;
	mastery = JSON.parse(request('GET', 'https://na.api.pvp.net/championmastery/location/na1/player/' + id + '/champions?api_key='+apiKey).body);
	res.json({rank:rank, mastery:mastery});
});

router.get('/champion/:championId/', function(req, res){
	champCollection.find({"championId":parseInt(req.params.championId)}, function(err, docs){
		res.json(docs)
	});
});

router.get('/recommender/champion/:championId/', function(req, res){
	recCollection.find({"id":req.params.championId}, function(err, docs){
		res.json(docs)
	});
});

router.get('/champions', function(req, res){
	champCollection.find({"league":"UNRANKED", championLevel:1}, function(err, docs){
		champions = []
		for(var x = 0; x < docs.length; x++){
			champion = {}
			champion.id = docs[x].championId;
			champion.name = docs[x].name;
			champions.push(champion);
		}
		res.json(champions);
	});
});

router.get('/data', function(req, res){
	champCollection.find({},function(err, docs){
		res.json(docs);
	});
});
 
 
 app.use(express.static('public'));
 app.use('/api', router);
 
 app.listen(80, function(){
 	console.log('App listening on port 80');
 });
