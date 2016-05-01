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

champCollection = db.get('champion');
summonerCollection = db.get('summoners');





 


function InsertIntoDB(obj){
	console.log(obj)
	champCollection.find({champId:obj.champId, region:obj.region, rank:obj.rank, championLevel:obj.championLevel}, function(err, docs){
		if(docs.length <= 0){
			console.log("Inserting");
			obj.count = 1;
			champCollection.insert(obj);
		}else{
			console.log("Updating");
			var data = docs[0];
			data.championPoints = (data.championPoints * data.count + obj.championPoints) / data.count+1;
			data.count++;
			champCollection.update(docs[0]._id, {$set:{count:data.count}}, function(err, docs){
				console.log(docs);
			});
		}
	})
}

router.post("/summoner", function(req, res){
	console.log(req.body.summonerName);
	summonerCollection.insert({summonerName:req.body.summonerName, region:req.body.region, processed: false, crawl:false}, function(err, docs){
		console.log("Inserted");
	})
	res.send("true");
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
				console.log(docs);
			});
		}
		res.json(docs);	
	})
});

router.get('/region/:region/username/:name/', function(req, res){
	var username = req.params.name.toLowerCase();
	var region = req.params.region.toLowerCase();
	id = JSON.parse(request('GET', 'https://na.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + username + '?api_key=' + apiKey).body)[username].id;
	rank = JSON.parse(request('GET', 'https://na.api.pvp.net/api/lol/' + region + '/v2.5/league/by-summoner/' + id + '?api_key='+apiKey).body)[id].filter(function(item){return item.queue == "RANKED_SOLO_5x5"})[0].tier;
	mastery = JSON.parse(request('GET', 'https://global.api.pvp.net/championmastery/location/' + region + '1/player/' + id + '/champions?api_key='+apiKey).body);
	for(var i = 0; i < mastery.length; i++){
		var temp = {}
		temp.region = region;
		temp.rank = rank;
		temp.champId = mastery[i].championId;
		temp.championLevel = mastery[i].championLevel;
		temp.championPoints = mastery[i].championPoints;
		InsertIntoDB(temp);
	}
	summonerCollection.update({username:username}, {$set:{processed:true}}, function(err, docs){
				console.log(docs);
			});
	res.send("Processing user: " + username + " in region " + region);

});




router.get('/region/:region/userid/:id/', function(req, res){
	https.get('https://global.api.pvp.net/championmastery/location/' + req.params.region + '/player/' + req.params.id + '/champions?api_key='+apiKey, function(res) {
 	 console.log(res[0]);
	});
});

router.get('/data', function(req, res){
	champCollection.find({},function(err, docs){
		console.log(docs.length);
		res.json(docs);
	});
});

app.use('/api', router);

app.listen(3000, function(){
	console.log('Example app listening on port 3000!');
});