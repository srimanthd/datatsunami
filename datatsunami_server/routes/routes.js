var express = require('express');
var router = express.Router();

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

module.exports = router;
