var app = angular.module('livingmetaanalysis', ['ui.router', 'ngHandsontable', 'ngTagsInput']);

// app state config
app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'UserCtrl'
      })
      .state('metaanalyses', {
        url: '/metaanalyses',
        templateUrl: '/metaanalyses.html',
        controller: 'MetaAnalysesCtrl',
        resolve: {
          metaAnalyses: ['$stateParams', 'metaAnalyses', function($stateParams, metaAnalyses) {
            return metaAnalyses.getAll();
          }]
        }
      })
      .state('metaanalyses/create', {
        url: '/metaanalyses/create',
        templateUrl: 'metaanalyses/create.html',
        controller: 'MetaAnalysesCtrl'
      })
      .state('metaanalyses/id', {
        url: '/metaanalyses/:id',
        templateUrl: '/metaanalysis.html',
        controller: 'MetaAnalysisCtrl',
        resolve: {
          metaAnalysis: ['$stateParams', 'metaAnalyses', function($stateParams, metaAnalyses) {
            return metaAnalyses.get($stateParams.id);
          }]
        }
      })
      .state('studies/create', {
        url: '/studies/create',
        templateUrl: 'studies/create.html',
        controller: 'StudiesCtrl'
      })
      .state('studies/id', {
        url: '/studies/:id',
        templateUrl: '/study.html',
        controller: 'StudyCtrl',
        resolve: {
          study: ['$stateParams', 'studies', function($stateParams, studies) {
            return studies.get($stateParams.id);
          }]
        }
      });
    $urlRouterProvider.otherwise('home');
  }
]);

/* services */
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
    });
  };

  o.update = function(id, study) {
    return $http.put('/api/studies/' + id, study).then(function(res) {
      return res.data;
    });
  };

  o.addData = function(id, derivedData) {
    return $http.put('/api/studies/' + id + "/derivedData", derivedData).then(function(res) {
      studies.getAll();
      return res.data;
    });
  };

  return o;
}]);

// services
app.factory('metaAnalyses', ['$http', function($http) {

  var o = {
    metaAnalyses: []
  };

  o.create = function(metaAnalysis) {
    return $http.post('/api/metaanalyses', metaAnalysis).success(function(data) {
      o.metaAnalyses.push(data);
    });
  };

  o.get = function(id) {
    return $http.get('/api/metaanalyses/' + id).then(function(res) {
      return res.data;
    });
  };

  o.getAll = function() {
    return $http.get('/api/metaanalyses').success(function(data) {
      angular.copy(data, o.metaAnalyses);
    });
  };

  o.update = function(id, metaAnalysis) {
    return $http.put('/api/metaanalyses/' + id, metaAnalysis).success(function(res) {
      return res.data;
    });
  };

  o.create = function(metaAnalysis) {
    console.log(metaAnalysis);
    return $http.post('/api/metaanalyses', metaAnalysis).success(function(data) {
      o.metaAnalyses.push(data);
    });
  };

  return o;
}]);

/* Controllers */
app.controller('StudyCtrl', ['$scope', 'studies', 'study',
  function($scope, studies, study) {
    $scope.study = study;
    $scope.derivedData = study.derivedData;

    $scope.addStudyData = function() {
      var newDerivedData = {
        value: $scope.value,
        property: $scope.property,
        comment: $scope.comment,
        addedBy: "1"
      };
      studies.addData(study._id, newDerivedData);
    };
  }
]);

app.controller('UserCtrl', ['$http',
  '$scope',
  function($http, $scope, user) {
    $http.get('/api/user/1/metaanalyses').then(function(res) {
      $scope.userMetaAnalyses = res.data;
    });

    $http.get('/api/user/1/studies').then(function(res) {
      $scope.userStudies = res.data;
    });
  }
]);

app.controller('StudiesCtrl', ['$http',
  '$scope', 'studies',
  function($http, $scope, studies) {
    $scope.studies = studies.studies;
    $scope.authors = [{
      "author": ""
    }];
    var testArray = ['one', 'two'];
    $scope.addAuthor = function() {
      $scope.authors.push({
        'author': ''
      });
    };
    $scope.removeAuthor = function(index) {
      $scope.authors.splice(index, 1);
    };
    $scope.addStudy = function() {
      studies.create({
        title: $scope.title,
        author: [$scope.author],
        link: $scope.link,
        year: $scope.year
      });
      $scope.title = '';
      $scope.author = '';
      $scope.year = '';
    };

    $scope.search = function() {
      $http.get('/api/studies/tag/' + $scope.searchTerm).then(function(res) {
        $scope.searchResults = res.data;
        return res.data;
      });
    };
  }
]);

app.controller('MetaAnalysisCtrl', [
  '$http', '$scope', '$state', 'metaAnalyses', 'metaAnalysis', 'studies',
  function($http, $scope, $state, metaAnalyses, metaAnalysis, studies) {
    $scope.metaAnalysis = metaAnalysis;
    $scope.properties = metaAnalysis.properties;

    var i = 0;
    var studiesArray = [];

    for (i; i < metaAnalysis.studies.length; i++) {
      var currentStudy = studies.get(metaAnalysis.studies[i]);
      studiesArray.push(currentStudy);
    }
    $scope.studies = studiesArray;
    console.log(studiesArray);
    // adds a new property to the meta-analysis
    $scope.addPropertyToMetaAnalysis = function() {
      metaAnalysis.properties.push($scope.newProperty);
      metaAnalyses.update(metaAnalysis._id, metaAnalysis);
    };

    // adds study to meta-analysis
    $scope.addStudyToMetaAnalysis = function(study) {
      metaAnalysis.studies.push(study);
      metaAnalyses.update(metaAnalysis._id, metaAnalysis);
    };

    // used to obtain scope values
    $scope.setupStudyPropertyScope = function(study, property) {
      $scope.study = study;
      $scope.property = property;
    };

    // adds a propety to the study
    $scope.addPropertyToStudy = function(study) {
      var newDerivedData = {
        value: $scope.value,
        property: $scope.property,
        comment: $scope.comment,
        addedBy: "1"
      };
      studies.addData($scope.study._id, newDerivedData);
      // refresh state is needed to repopulate table
      $state.go($state.current, {}, {
        reload: true
      });
    };

    // removes a property from the meta-analysis
    $scope.removePropertyFromMetaAnalysis = function(property) {
      var index = metaAnalysis.properties.indexOf(property);
      metaAnalysis.properties.splice(index, 1);
      metaAnalyses.update(metaAnalysis._id, metaAnalysis);
    };

    // used to detect whether the study has had that property derived
    $scope.getStudyProperty = function(study, property) {
      for (var i = 0; i < study.derivedData.length; i++) {
        if (study.derivedData[i].property == property) {
          return study.derivedData[i].value;
        }
      }
      return null;
    };

    // adds a new study
    $scope.addNewStudy = function() {
      var tagsArray = [];
      for (var i = 0; i < $scope.tags.length; i++) {
        tagsArray.push($scope.tags[i].text);
      }
      $http.post('/api/studies', {
        title: $scope.title,
        author: $scope.author,
        year: $scope.year,
        link: $scope.link,
        tags: tagsArray
      });
    };
  }
]);

app.controller('MetaAnalysesCtrl', [
  '$scope', 'metaAnalyses',
  function($scope, metaAnalyses) {
    $scope.metaAnalyses = metaAnalyses.data;

    $scope.newMetaAnalysis = function() {
      var tagsArray = [];
      for (var i = 0; i < $scope.tags.length; i++) {
        tagsArray.push($scope.tags[i].text);
      }
      console.log(tagsArray);
      metaAnalyses.create({
        title: $scope.title,
        description: $scope.description,
        owner: "1",
        tags: tagsArray
      });
      console.log($scope.tags);
      $scope.title = '';
      $scope.description = '';
      $scope.tags = [];

    };
  }
]);
