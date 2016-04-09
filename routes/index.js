var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');

var jwt = require('express-jwt');
var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* import models */
var User = mongoose.model('User');
var Study = mongoose.model('Study');
var MetaAnalysis = mongoose.model('MetaAnalysis');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});


// user register routes
router.post('/register', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  var user = new User();

  user.username = req.body.username;

  user.setPassword(req.body.password);

  user.save(function (err){
    if(err){ return next(err); }

    return res.json({token: user.generateJWT()});
  });
});

// login route
router.post('/login', function(req, res, next){
  if(!req.body.username || !req.body.password){
    return res.status(400).json({message: 'Please fill out all fields'});
  }

  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
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

// GET: study
router.get('/api/studies/:study', function(req, res) {
  res.json(req.study);
});

router.put('/api/studies/:study/derivedData', auth, function(req, res, next) {
  req.body.addedBy = req.payload.username;
  Study.findByIdAndUpdate(
        req.params.study,
        {$push: {"derivedData": req.body}},
        {safe: true, upsert: true, new : true},
        function(err, study) {
            console.log(err);
        }
    );
});


// user param
router.param('username', function(req, res, next, username) {
  var query = MetaAnalysis.find({
    'owner': username
  });

  query.exec(function(err, metaAnalyses, studies) {
    if (err) {
      return next(err);
    }
    if (!metaAnalyses) {
      return next(new Error('cannot find study'));
    }

    var query = Study.find({
      'derivedData.addedBy': username
    });

    query.exec(function(err, studies) {
      if (err) {
        return next(err);
      }
      if (!studies) {
        return next(new Error('cannot find studies'));
      }
    });

    req.metaAnalyses = metaAnalyses;
    req.studies = studies;
    return next();
  });
});

// get meta-analyses for particular user
router.get('/api/user/:username/metaanalyses', function(req, res, next) {
    res.json(req.metaAnalyses);
});

// param
router.param('tag', function(req, res, next, tag) {
  var query = Study.find({
    'tags': tag
  });

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
router.post('/api/metaanalyses', auth, function(req, res, next) {
  var metaAnalysis = new MetaAnalysis(req.body);
  metaAnalysis.owner = req.payload.username;
  metaAnalysis.save(function(err, metaAnalysis) {
    if (err) {
      console.log(err);
      return next(err);
    }
    res.json(metaAnalysis);
  });
});

// param
router.param('metaanalysis', function(req, res, next, id) {
  var query = MetaAnalysis.findById(id);

  // populates the referenced objects
  query.populate('studies');
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
  MetaAnalysis.findByIdAndUpdate(
        req.params.metaanalysis,
         req.body,
        {safe: true, upsert: true, new : true},
        function(err, study) {
          console.log(err);
        }
    );
});

// get meta-analyses for particular user
router.get('/api/user/:username/metaanalyses', function(req, res, next) {
    res.json(req.metaAnalyses);
});

// get study data added by particular user
router.get('/api/user/:username/studies', function(req, res, next) {
    res.json(req.studies);
});

module.exports = router;
