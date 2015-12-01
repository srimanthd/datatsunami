/**
  * @author : Srimanth Duggineni
  * @commit date : 12/1/2015
*/


var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);

console.log("connection is being established");
server.listen(9999);
console.log("connection established");

io.on('connection', function (socket) {

  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });

  socket.on('need data', function(data) {
        console.log("somebody needs data");
	var mongodb = require('mongodb');

	var MongoClient = mongodb.MongoClient;

	var url = 'mongodb://localhost:27017/test';

	MongoClient.connect(url, function (err, db) {
  	if (err) {
		console.log('Unable to connect to the mongoDB server. Error:', err);
  	} else {
		var collection = db.collection("TrendingTweets");
		collection.findOne(function(err,item) {
		console.log(item);
		socket.emit('take data', item);
		db.close();
         	});
  	}

	});
  });

});
