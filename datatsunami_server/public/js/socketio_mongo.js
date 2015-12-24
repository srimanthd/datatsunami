
var server = require('http').createServer();
var socketio = require('socket.io')(server);

server.listen(4000);

var mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/test';
var MongoClient = mongodb.MongoClient;
var sleep = require('sleep')

collectionObject = null;

MongoClient.connect(url, function (err, db) {

	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
	} else {
		dbObject = db;
		collectionObject = db.collection("TwitterTrends");
  }
});

itemObject = {}

socketio.on('connection', function(socket){
	var getUpdates = function() {

						if (collectionObject!=null){
							collectionObject.findOne(function(err,item) {
							console.log("Look");
							socket.emit('takethis',item);
						});
						}
						else{
							console.log("Patience nigga!!");
						}
	};

	setInterval(getUpdates, 3000);
	
})