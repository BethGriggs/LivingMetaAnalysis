var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

/* import models */
var Experiment = mongoose.model('Experiment');
var Interpretation = mongoose.model('Interpretation');
var DerivedData = mongoose.model('DerivedData');
var MetaAnalysis = mongoose.model('MetaAnalysis');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* experiments routes */

// get experiments route
router.get('/api/experiments', function(req, res, next) {
  Experiment.find(function(err, experiments) {
    if (err) {
      return next(err);
    }
    res.json(experiments);
  });
});

// post experiments route
router.post('/api/experiments', function(req, res, next) {
  var experiment = new Experiment(req.body);
  console.log(experiment);
  experiment.save(function(err, experiment) {
    if (err) {
      return next(err);
    }
    res.json(experiment);
  });
});

// param
router.param('experiment', function(req, res, next, id) {
  var query = Experiment.findById(id);

  query.exec(function(err, experiment) {
    if (err) {
      return next(err);
    }
    if (!experiment) {
      return next(new Error('can\'t find thing'));
    }

    req.experiment = experiment;
    return next();
  });
});

router.get('/api/experiments/:experiment', function(req, res) {
  res.json(req.experiment);
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
  var metaAnalysis = new MetaAnalysis(req.body);
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

router.put('/api/metaanalyses/:metaanalysis',  function(req, res, next) {
  MetaAnalysis.findOneAndUpdate({_id:req.params.id}, req.body, function (err, metaAnalysis) {
  res.send(metaAnalysis);
});
});


module.exports = router;
