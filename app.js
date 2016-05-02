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
 
 champCollection = db.get('champion');
 
 var region = 'na'
 
 
 router.get('/region/:region/username/:name/', function(req, res){
 	var username = req.params.name.toLowerCase();
 	var region = req.params.region.toLowerCase();
 	id = JSON.parse(request('GET', 'https://global.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + username + '?api_key=' + apiKey).body)[username].id;
 	rank = JSON.parse(request('GET', 'https://global.api.pvp.net/api/lol/' + region + '/v2.5/league/by-summoner/' + id + '?api_key='+apiKey).body)[id].filter(function(item){return item.queue == "RANKED_SOLO_5x5"})[0].tier;
 	mastery = JSON.parse(request('GET', 'https://global.api.pvp.net/championmastery/location/' + region + '1/player/' + id + '/champions?api_key='+apiKey).body);
 	res.json({rank:rank, mastery:mastery});
 });

 router.get('/region/:region/league/:league/champion/:champion/', function(req, res){
 	champCollection.find({region:req.params.region, league:req.params.league, champion:req.params.champion}, function(err, docs){
    	console.log("STUFF");
    	res.json(docs)
  	});
 });

 
 router.get('/data', function(req, res){
 	champCollection.find({},function(err, docs){
 		res.json(docs);
 	});
 });
 
 
 app.use(express.static('public'));
 app.use('/api', router);
 
 app.listen(3000, function(){
 	console.log('App listening on port 3000!');
 });