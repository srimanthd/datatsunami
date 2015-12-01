
/**
  * @author : Srimanth Duggineni
  * @commit date : 12/1/2015
*/

var mongodb = require('mongodb');

//We need to work with "MongoClient" interface in order to connect to a mongodb server.
var MongoClient = mongodb.MongoClient;

// Connection URL. This is where your mongodb server is running.
var url = 'mongodb://localhost:27017/test';

MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
         var collection = db.collection("TrendingTweets");
         collection.findOne(function(err,item) {
             console.log(item);
             db.close();
         });
  }
});
