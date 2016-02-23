var app = angular.module('livingmetaanalysis', ['ui.router', 'ngHandsontable']);

// app state config
app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // name: home, url = /home, templateurl = /home.html
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
      })
      .state('studies', {
        url: '/studies',
        templateUrl: '/studies.html',
        controller: 'StudiesCtrl',
        resolve: {
          studyPromise: ['studies', function(studies) {
            return studies.getAll();
          }]
        }
      })
      .state('studies/create', {
        url: '/studies/create',
        templateUrl: '/studies/create.html',
        controller: 'StudiesCtrl',
        resolve: {
          postPromise: ['studies', function(studies) {
            return studies.getAll();
          }]
        }
      })
      .state('study', {
        url: '/studies/:id',
        templateUrl: '/study.html',
        controller: 'StudyCtrl',
        resolve: {
          study: ['$stateParams', 'studies', function($stateParams, studies) {
            return studies.get($stateParams.id);
          }]
        }
      })
      .state('experiments', {
        url: '/experiments',
        templateUrl: '/experiments.html',
        controller: 'ExperimentsCtrl',
        resolve: {
          post: ['$stateParams', 'experiments', function($stateParams, experiments) {
            return experiments.getAll();
          }]
        }
      })
      .state('metaanalyses/create', {
        url: '/metaanalyses/create',
        templateUrl: 'metaanalyses/create.html',
        controller: 'MetaAnalysesCtrl'
      })
      .state('metaanalysis', {
        url: '/metaanalyses/:id',
        templateUrl: '/metaanalysis.html',
        controller: 'MetaAnalysisCtrl',
        resolve: {
          metaAnalysis: ['$stateParams', 'metaAnalyses', function($stateParams, metaAnalyses) {
            return metaAnalyses.get($stateParams.id);
          }]
        }
      });

    $urlRouterProvider.otherwise('home');
  }
]);


// services
app.factory('studies', ['$http', function($http) {

  var o = {
    studies: []
  };
  o.getAll = function() {
    return $http.get('/api/studies').success(function(data) {
      angular.copy(data, o.studies);
    });
  };
  o.create = function(study) {
    return $http.post('/api/studies', study).success(function(data) {
      o.studies.push(data);
    });
  };

  o.get = function(id) {
    return $http.get('/api/studies/' + id).then(function(res) {
      return res.data;
    })
  };

  return o;
}]);

// services
app.factory('metaAnalyses', ['$http', function($http) {

  var o = {
    metaAnalyses: []
  };
  o.create = function(metaAnalysis) {
    console.log(metaAnalysis);
    return $http.post('/api/metaanalyses', metaAnalysis).success(function(data) {
      console.log("get here");
      o.metaAnalyses.push(data);
    });
  };

  o.get = function(id) {
    return $http.get('/api/metaanalyses/' + id).then(function(res) {
      return res.data;
    })
  };

  o.update = function(id, metaAnalysis) {
    return $http.put('/api/metaanalyses/' + id, metaAnalysis).then(function(res) {
      return res.data;
    })
  };

  return o;
}]);

// services
app.factory('experiments', ['$http', function($http) {

  var o = {
    experiments: []
  };

  o.getAll = function() {
    return $http.get('/api/studies').success(function(data) {
      var experiments = res.data;
      console.log(experiments);
      // for (experiment in experiments) {
      //   o.experiments.push(experiment);
      // }
    });
  };

  return o;
}]);


/* Controllers */
app.controller('StudyCtrl', [
  '$scope', 'study',
  function($scope, study) {
    $scope.study = study;
  }
]);

app.controller('MainCtrl', [
  '$scope',
  function($scope) {}
]);

app.controller('StudiesCtrl', [
  '$scope', 'studies',
  function($scope, studies) {
    $scope.studies = studies.studies;
    $scope.authors = [];
    var testArray = ['one', 'two'];
    $scope.addAuthor = function() {
      $scope.authors.push({
        'author': ''
      });
    }
    $scope.removeAuthor = function(index) {
      $scope.authors.splice(index, 1);
    }
    $scope.addStudy = function() {
      studies.create({
        title: $scope.title,
        author: ['Author1', 'Author2'],
        year: '2000'
      });
      $scope.title = '';
      $scope.author = '';
      $scope.year = '';
    };
  }
]);

app.controller('MetaAnalysisCtrl', [
  '$scope', 'metaAnalyses', 'metaAnalysis',
  function($scope, metaAnalyses, metaAnalysis) {
    $scope.metaAnalysis = metaAnalysis;
    $scope.settings = {
      contextMenu: [
        'row_above', 'row_below', 'remove_row'
      ]
    };
    $scope.minSpareRows = 5;
    $scope.rowHeaders = true;
    $scope.colHeaders = true;
    $scope.items = [{
      name: 1
    }, {
      name: 2
    }, {
      name: 2
    }, {
      name: 4
    }, {
      name: 5
    }];
    $scope.updateMetaAnalysis = function(){
      console.log(metaAnalysis._id);
      $scope.metaAnalysis.title = "updated yo";
      metaAnalyses.update(metaAnalysis._id, $scope.metaAnalysis);
  }}
]);

app.controller('MetaAnalysesCtrl', [
  '$scope', 'metaAnalyses',
  function($scope, metaAnalyses) {
    $scope.newMetaAnalysis = function() {
      metaAnalyses.create({
        title: $scope.title,
        description: $scope.description
      });
      $scope.title = '';
      $scope.description = '';
    }
  }
]);


app.controller('ExperimentsCtrl', [
  '$scope', 'experiments',
  function($scope, experiments) {
    $scope.experiments = experiments.experiments;
  }
]);
