var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

// import models
var Study = mongoose.model('Study');
var Experiment = mongoose.model('Experiment');
var Interpretation = mongoose.model('Interpretation');
var DerivedData = mongoose.model('DerivedData');
var MetaAnalysis = mongoose.model('MetaAnalysis');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});


/* Studies routes */

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

// param
router.param('study', function(req, res, next, id) {
  var query = Study.findById(id);

  query.exec(function(err, study) {
    if (err) {
      return next(err);
    }
    if (!study) {
      return next(new Error('can\'t find thing'));
    }

    req.study = study;
    return next();
  });
});

router.get('/api/studies/:study', function(req, res) {
  res.json(req.study);
});

/* Meta-analysis routes */

// get meta-analyses route
router.get('/api/metaanalyses', function(req, res, next) {
  MetaAnalysis.find(function(err, metaAnalyses) {
    if (err) {
      return next(err);
    }
    res.json(metaAnalyses);
  });
});

// post meta-analyses route
router.post('/api/metaanalyses', function(req, res, next) {
  console.log(req.body);
  var metaAnalysis = new MetaAnalysis(req.body);
  console.log(metaAnalysis);
  metaAnalysis.save(function(err, metaAnalysis) {
    if (err) {
      return next(err);
    }
    res.json(metaAnalysis);
  });
});

// param
router.param('metaanalysis', function(req, res, next, id) {
  var query = MetaAnalysis.findById(id);

  query.exec(function(err, metaAnalysis) {
    if (err) {
      return next(err);
    }
    if (!metaAnalysis) {
      return next(new Error('can\'t find thing'));
    }

    req.metaAnalysis = metaAnalysis;
    return next();
  });
});

router.get('/api/metaanalyses/:metaanalysis', function(req, res) {
  res.json(req.metaAnalysis);
});

module.exports = router;
