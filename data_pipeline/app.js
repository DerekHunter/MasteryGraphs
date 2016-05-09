var express = require('express');
var https = require('https')
var db = require('monk')('localhost:27017/data');
var request = require('sync-request');
var fs = require('fs');
var bodyParser = require('body-parser');

var apiKey = JSON.parse(fs.readFileSync('../config.txt', 'utf8')).key;
if (apiKey == ''){
	console.log("Not a valid api key");
}


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

champCollection = db.get('champions');
summonerCollection = db.get('summoners');
recommenderCollection = db.get('recommender');



 


function InsertIntoDB(obj){
	champCollection.find({championId:obj.championId, league:obj.league, championLevel:obj.championLevel}, function(err, docs){
		var data = docs[0];
		data.championPoints = ((data.championPoints * data.count) + obj.championPoints) / (data.count+1);
		data.count++;
		champCollection.update(docs[0]._id, {$set:{count:data.count, championPoints:data.championPoints}}, function(err, docs){
			if(err != null) console.log(err);
		});
	})
}

router.post("/summoner", function(req, res){
	console.log("Insert: "+req.body.summonerName);
	summonerCollection.find({summonerName:req.body.summonerName},function(err,docs){
		if(docs.length == 0){
			summonerCollection.insert({summonerName:req.body.summonerName, processed: false, crawl:false}, function(err, docs){
				if(err != null) console.log(err);
			})	
		}
	})
	res.send("Insert Summoner");
});

router.get("/next/process", function(req, res){
	summonerCollection.findOne({processed: false}, function(err, docs){
		res.json(docs);	
	})
});

router.get("/next/crawl", function(req, res){
	summonerCollection.findOne({crawl: false}, function(err, docs){
		if(docs != null){
			summonerCollection.update(docs._id, {$set:{crawl:true}}, function(err, docs){
				if(err != null) console.log(err);
			});
		}
		res.json(docs);	
	})
});

router.get('/data', function(req, res){
	champCollection.find({},function(err, docs){
		console.log(docs.length);
		res.json(docs);
	});
});

router.post('/recommender/champion/:championId', function(req, res){
	var champId = req.params.championId;
	console.log(champId);
	console.log(req.body);
	// recommenderCollection.insert({summonerName:req.body.summonerName, processed: false, crawl:false}, function(err, docs){
	// 	if(err != null) console.log(err);
	// });
});

router.post('/process', function(req, res){
	var summonerName = req.body.summonerName.toLowerCase().replace(/ /g,'');
	console.log("Process: " + summonerName)
	summonerCollection.update({summonerName:summonerName}, {$set:{processed:true}}, function(err, docs){
		if(err!=null) console.log(err);
	});
	try{
		id = JSON.parse(request('GET', 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + summonerName + '?api_key=' + apiKey).body)[summonerName].id;
		league = JSON.parse(request('GET', 'https://na.api.pvp.net/api/lol/na/v2.5/league/by-summoner/' + id + '?api_key='+apiKey).body)[id].filter(function(item){return item.queue == "RANKED_SOLO_5x5"})[0].tier;	
	}catch(err){
		league = "UNRANKED";
	}
	
	mastery = JSON.parse(request('GET', 'https://na.api.pvp.net/championmastery/location/na1/player/' + id + '/champions?api_key='+apiKey).body);
	for(var i = 0; i < mastery.length; i++){
		var temp = {}
		temp.league = league;
		temp.championId = mastery[i].championId;
		temp.championLevel = mastery[i].championLevel;
		temp.championPoints = mastery[i].championPoints;
		if(temp.championLevel == 0){
			console.log("FOUND");
		}
		InsertIntoDB(temp);
	}
	res.send("Processing user: " + summonerName);
});



app.use('/api', router);

app.listen(3000, function(){
	console.log('Example app listening on port 3000!');
});