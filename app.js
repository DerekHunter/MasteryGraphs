var express = require('express');
var https = require('https')
var db = require('monk')('localhost:27017/data');
var request = require('sync-request');
var app = express();
var router = express.Router();

var apiKey = ''
if (apiKey == ''){
	console.log("Not a valid api key");
} 

champCollection = db.get('champion');

var region = 'na'
// https.get('https://global.api.pvp.net/championmastery/location/' + region + '/player/' + userId + '/champion?api_key='+apiKey, function(res) {
//   console.log(res);
//   // champBuffer = ''
//   // res.on('data', function(data){
//   //   champBuffer += data
//   // });
//   // res.on('end', function(err){
//   //   staticChampData = JSON.parse(champBuffer).data;
//   //   console.log("Loaded Champ Data")
//   // })
// });



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
		
		champCollection.find({champId:temp.champId, region:temp.region, rank:temp.rank, championLevel:temp.championLevel}, function(err, docs){
			if(docs.length <= 0){
				console.log("Inserting");
				temp.count = 1;
				champCollection.insert(temp);
			}else{
				console.log("Updating");
				var data = docs[0];
				data.championPoints = (data.championPoints * data.count + temp.championPoints) / data.count+1;
				data.count++;
				champCollection.update(docs[0]._id, {$set:{count:data.count}}, function(err, docs){
					console.log(docs);
				});
			}
		})
	}

	res.send("PENIS");
	// https.get('https://global.api.pvp.net/api/lol/' + region + '/v1.4/summoner/by-name/' + username + '?api_key='+apiKey, function(res) {
	//  		buffer = ""
	// 		res.on('data', function(data){
	// 			buffer += data
	// 		});
	// 		res.on('end', function(err){
	// 			response = JSON.parse(buffer);
	// 			userId = response[username].id;
	// 		});
	// });
});

router.get('/region/:region/userid/:id/', function(req, res){
	https.get('https://global.api.pvp.net/championmastery/location/' + req.params.region + '/player/' + req.params.id + '/champions?api_key='+apiKey, function(res) {
 	 console.log(res[0]);
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
	console.log('Example app listening on port 3000!');
});