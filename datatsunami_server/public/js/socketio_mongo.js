
var server = require('http').createServer();
var socketio = require('socket.io')(server);
var fs = require('fs');

server.listen(4000);

var mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/test';
var MongoClient = mongodb.MongoClient;
var sleep = require('sleep')

var param = fs.readFileSync('time.stamp').toString();
console.log(param);
ts = { "timestamp": parseFloat(param.split("\n")[0]) }
collectionObject = null;
cursor = null;

MongoClient.connect(url, function (err, db) {

	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	} else {
		dbObject = db;
		collectionObject = db.collection("TwitterTrends");
  }
});

itemObject = {};

socketio.on('connection', function(socket){
	var getUpdates = function() {

						if (collectionObject!=null){
							console.log(ts);
							cursor = collectionObject.find(ts)
							cursor.each(function(err, doc) {
								if(doc!=null){
									console.log(doc);
									socket.emit('takethis',doc);
								}
								else{
									console.log(doc);
								}
							});
						}
						else{
							console.log("Patience nigga!!");
						}
	};

	setInterval(getUpdates, 3000);
	
});