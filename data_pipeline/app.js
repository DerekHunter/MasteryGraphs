var express = require('express');
var https = require('https')
var db = require('monk')('localhost:27017/data');
var request = require('sync-request');
var fs = require('fs');
var bodyParser = require('body-parser');

var apiKey = JSON.parse(fs.readFileSync('../config.txt', 'utf8')).key;
console.log(apiKey);
if (apiKey == ''){
	console.log("Not a valid api key");
}


var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var router = express.Router();

champCollection = db.get('champions');
summonerCollection = db.get('summoners');



 


function InsertIntoDB(obj){
	champCollection.find({champId:obj.champId, region:obj.region, league:obj.league, championLevel:obj.championLevel}, function(err, docs){
		if(docs.length <= 0){
			obj.count = 1;
			champCollection.insert(obj);
		}else{
			var data = docs[0];
			data.championPoints = ((data.championPoints * data.count) + obj.championPoints) / (data.count+1);
			data.count++;
			champCollection.update(docs[0]._id, {$set:{count:data.count, championPoints:data.championPoints}}, function(err, docs){
				if(err != null) console.log(err);
			});
		}
	})
}

router.post("/summoner", function(req, res){
	console.log(req.body.summonerName);
	summonerCollection.find({summonerName:req.body.summonerName, region:req.body.region},function(err,docs){
		if(docs.length == 0){
			summonerCollection.insert({summonerName:req.body.summonerName, region:req.body.region, processed: false, crawl:false}, function(err, docs){
				if(err != null) console.log(err);
			})	
		}
	})
	res.send("Insert Summoner");
});

router.get("/next/process/region/:region", function(req, res){
	summonerCollection.findOne({region:req.params.region, processed: false}, function(err, docs){
		res.json(docs);	
	})
});

router.get("/next/crawl/region/:region", function(req, res){
	summonerCollection.findOne({region:req.params.region, crawl: false}, function(err, docs){
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

router.post('/process', function(req, res){
	
	var summonerName = req.body.summonerName.toLowerCase().replace(/ /g,'');
	var region = req.body.region.toLowerCase();
	console.log("Storing: " + req.body.summonerName.toLowerCase().replace(" ", ""));
	summonerCollection.update({summonerName:summonerName}, {$set:{processed:true}}, function(err, docs){
		if(err!=null) console.log(err);
	});
	id = JSON.parse(request('GET', 'https://'+region+'.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + summonerName + '?api_key=' + apiKey).body)[summonerName].id;
	try{
		league = JSON.parse(request('GET', 'https://'+region+'.api.pvp.net/api/lol/' + region + '/v2.5/league/by-summoner/' + id + '?api_key='+apiKey).body)[id].filter(function(item){return item.queue == "RANKED_SOLO_5x5"})[0].tier;	
	}catch(err){
		league = "UNRANKED";
	}
	
	mastery = JSON.parse(request('GET', 'https://'+region+'.api.pvp.net/championmastery/location/' + region + '1/player/' + id + '/champions?api_key='+apiKey).body);
	for(var i = 0; i < mastery.length; i++){
		var temp = {}
		temp.region = region;
		temp.league = league;
		temp.champId = mastery[i].championId;
		temp.championLevel = mastery[i].championLevel;
		temp.championPoints = mastery[i].championPoints;
		InsertIntoDB(temp);
	}
	res.send("Processing user: " + summonerName + " in region " + region);
});



app.use('/api', router);

app.listen(3000, function(){
	console.log('Example app listening on port 3000!');
});