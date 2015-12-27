var express = require('express');
var router = express.Router();
var cp = require('child_process');
var cp_1 = null;
var cp_2 = null;
var cp_3 = null;
var cp_4 = null;

status_1 = "Inactive";
status_2 = "Inactive";
status_3 = "Inactive";
status_4 = "Inactive";

pid_1 = "Not Running/Stopped";
pid_2 = "Not Running/Stopped";
pid_3 = "Not Running/Stopped";
pid_4 = "Not Running/Stopped";


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

  res.send( { status_1: status_1, status_2: status_2, status_3: status_3, status_4: status_4, pid_1: pid_1, pid_2: pid_2, pid_3: pid_3,pid_4:pid_4 } );

});

router.get('/start_1', function(req, res, next) {

  var spawn_1 = cp.spawn;
  if(cp_1 == null){
      cp_1 = spawn_1('python3',['../streaming_server.py']);
	  pid_1 = cp_1.pid;
	  status_1 = "Active"
      res.send({ status_1 : status_1, pid_1: pid_1 });
  }
  else{
      console.log("Already running"); 
  }

});

router.get('/start_2', function(req, res, next) {

  var spawn_2 = cp.exec;
  if(cp_2 == null){
      cp_2 = spawn_2('spark-submit --master local[2] ../top_trends.py localhost 5009', function(error, stdout, stderr) {});
	  pid_2 = cp_2.pid+1;
      status_2 = "Active"
	  res.send({ status_2 : status_2, pid_2: pid_2 });
  }
  else{
      console.log("Already running");
  }

});

router.get('/start_3', function(req, res, next) {

  var spawn_3 = cp.spawn;
  if(cp_3 == null){
      cp_3 = spawn_3('node',['public/js/socketio_mongo.js']);
	  pid_3 = cp_3.pid;
	  status_3 = "Active"
      res.send({ status_3 : status_3, pid_3: pid_3 });
  }
  else{
      console.log("Already running");
  }

});

router.get('/start_4', function(req, res, next) {

  var spawn_4 = cp.spawn;
  if(cp_4 == null){
      cp_4 = spawn_4('node',['node_modules/mongo-express/app.js']);
	  pid_4 = cp_4.pid;
	  status_4 = "Active"
      res.send({ status_4 : status_4, pid_4: pid_4 });
  }
  else{
      console.log("Already running"); 
  }

});


router.get('/stop_1', function(req, res, next) {
  cp_1.kill();
  cp_1 = null;
  status_1 = "Inactive";
  pid_1 = "Not Running/Stopped";
  res.send({ status_1 : status_1, pid_1: pid_1 });

});

router.get('/stop_2', function(req, res, next) {
  var force_killer = cp.spawn;
  force_killer('kill',['-9',cp_2.pid+1]);
  cp_2 = null;
  status_2 = "Inactive";
  pid_2 = "Not Running/Stopped";
  res.send({ status_2 : status_2, pid_2: pid_2 });

});

router.get('/stop_3', function(req, res, next) {
  cp_3.kill();
  cp_3 = null;
  status_3 = "Inactive";
  pid_3 = "Not Running/Stopped"
  res.send({ status_3 : status_3, pid_3: pid_3 });

});

router.get('/stop_4', function(req, res, next) {
  cp_4.kill();
  cp_4 = null;
  status_4 = "Inactive";
  pid_4 = "Not Running/Stopped"
  res.send({ status_4 : status_4, pid_4: pid_4 });

});


module.exports = router;
