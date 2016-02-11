var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

// import models
var Study = mongoose.model('Study');
var Experiment = mongoose.model('Experiment');
var Interpretation = mongoose.model('Interpretation');
var DerivedData = mongoose.model('DerivedData');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

// get studies route
router.get('/api/studies', function(req, res, next) {
  Study.find(function(err, studies) {
    if (err) {
      return next(err);
    }
    res.json(studies);
  });
});

// post studies route
router.post('/api/studies', function(req, res, next) {
  var study = new Study(req.body);

  study.save(function(err, study) {
    if (err) {
      return next(err);
    }
    res.json(study);
  });
});

module.exports = router;
