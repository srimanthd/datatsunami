var express = require('express');
var router = express.Router();
var cp = require('child_process');
var cp_1 = null;
var cp_2 = null;
var cp_3 = null;

status_1 = "Inactive";
status_2 = "Inactive";
status_3 = "Inactive";

pid_1 = 0;
pid_2 = 0;
pid_3 = 0;


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('datatsunami', { title: 'Express' }); 

});

router.get('/trends', function(req, res, next) {
  res.render('trends', { title: 'Express' });

});

router.get('/cpanel', function(req, res, next) {
  res.render('cpanel', { title: 'Express' });

});

router.get('/defaults', function(req, res, next) {

  res.send( { status_1: status_1, status_2: status_2, status_3: status_3, pid_1: pid_1, pid_2: pid_2, pid_3: pid_3 } );

});

router.get('/start_1', function(req, res, next) {

  var spawn_1 = cp.spawn;
  if(cp_1 == null){
      cp_1 = spawn_1('python3',['../streaming_server.py']);
      res.send({ status_1 : "Active", pid_1: cp_1.pid });
  }
  else{
      console.log("Already running"); 
  }

});

router.get('/start_2', function(req, res, next) {

  var spawn_2 = cp.spawn;
  if(cp_2 == null){
      cp_2 = spawn_2('spark-submit',['--master','local[2]','../top_trends.py','localhost','5007']);
      res.send({ status_2 : "Active", pid_2: cp_2.pid });
  }
  else{
      console.log("Already running");
  }

});

router.get('/start_3', function(req, res, next) {

  var spawn_3 = cp.spawn;
  if(cp_3 == null){
      cp_3 = spawn_3('node',['public/js/socketio_mongo.js']);
      res.send({ status_3 : "Active", pid_3: cp_3.pid });
  }
  else{
      console.log("Already running");
  }

});

router.get('/stop_1', function(req, res, next) {
  cp_1.kill();
  cp_1 = null;
  res.send({ status_1 : "Inactive", pid_1: "Not Running/Stopped" });

});

router.get('/stop_2', function(req, res, next) {
  var force_killer = cp.spawn;
  force_killer('kill',['-9',cp_2.pid]);
  res.send({ status_2 : "Inactive", pid_2 : "Not Running/Stopped" });

});

router.get('/stop_3', function(req, res, next) {
  cp_3.kill();
  cp_3 = null;
  res.send({ status_3 : "Inactive", pid_3: "Not Running/Stopped" });

});


module.exports = router;
