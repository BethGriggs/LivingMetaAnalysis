var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');

/* import models */
var Study = mongoose.model('Study');
var DerivedData = mongoose.model('DerivedData');
var MetaAnalysis = mongoose.model('MetaAnalysis');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

/* studies routes */

// get studies route
router.get('/api/studies', function(req, res, next) {
  Study.find(function(err, studies) {
    if (err) {
      return next(err);
    }
    res.json(studies);
  });
});

// post study route
router.post('/api/studies', function(req, res, next) {
  var study = new Study(req.body);
  study.save(function(err, study) {
    if (err) {
      return next(err);
    }
    res.json(study);
  });
});

// study id param
router.param('study', function(req, res, next, id) {
  var query = Study.findById(id);

  query.exec(function(err, study) {
    if (err) {
      return next(err);
    }
    if (!study) {
      return next(new Error('cannot find study'));
    }

    req.study = study;
    return next();
  });
});

router.get('/api/studies/:study', function(req, res) {
  res.json(req.study);
});

// param
router.param('tag', function(req, res, next, tag) {
  var query = Study.find({'tags': tag});

  query.exec(function(err, studies) {
    if (err) {
      return next(err);
    }
    if (!studies) {
      return next(new Error('cannot find study'));
    }

    req.studies = studies;
    return next();
  });
});

router.get('/api/studies/tag/:tag', function(req, res) {
  res.json(req.studies);
 });

//api/studies/tag/
/* meta-analysis routes */

// GET all meta-analyses
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

router.put('/api/metaanalyses/:metaanalysis', function(req, res, next) {
  MetaAnalysis.findOneAndUpdate({
    _id: req.params.id
  }, req.body, function(err, metaAnalysis) {
    res.send(metaAnalysis);
  });
});

// get meta-analyses for particular user
router.get('/api/user/1/metaanalyses', function(req, res, next) {
  MetaAnalysis.find({
    "owner": "1"
  }, function(err, metaAnalyses) {
    if (err) {
      return next(err);
    }
    res.json(metaAnalyses);
  });
});



module.exports = router;
