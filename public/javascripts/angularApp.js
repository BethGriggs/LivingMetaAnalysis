var app = angular.module('livingmetaanalysis', ['ui.router', 'ngHandsontable']);

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
    return $http.put('/api/metaanalyses/' + id, metaAnalysis).then(function(res) {
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

  o.create = function(studies) {
    return $http.post('/api/studies', studies).success(function(data) {
      o.studies.push(data);
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

app.controller('UserCtrl', ['$http',
  '$scope',
  function($http, $scope, user) {
    $http.get('/api/user/1/metaanalyses').then(function(res) {
          $scope.userMetaAnalyses = res.data;
      });
  }
]);

app.controller('StudiesCtrl', [
  '$scope', 'studies',
  function($scope, studies) {
    $scope.studies = studies.studies;
    $scope.authors = [{"author":""}];
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
        year: $scope.year
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
    $scope.metaAnalyses = metaAnalyses.metaAnalyses;
    $scope.metaAnalysis = metaAnalysis;
    $scope.settings = {
      colHeaders: ['Experiment', 'No. Participants', 'Type of Participants', 'Misinformation Paradigm', 'Delay of Misinformation', 'No. of Misleading Details', 'Type of Misleading Details', '', '', '', ''],
      rowHeaders: false,
      comments: true,
      cell: [
        {row: 0, col: 0, comment: 'In all of Belli et al.’s (1994) experiments, memory for both original and misleading details was assessed.'},
        {row: 1, col: 0, comment: 'The memory performances in Exp. 2 are aggregated across several experimental and control conditions (that used different sources of original and misleading information'}
   ]
    };
    $scope.minSpareRows = 0;
    $scope.rowHeaders = true;
    $scope.colHeaders = true;
    $scope.items = [{
       experiment: 'BE94-Ex1', numberOfParticpants: 72 , typeOfParticipants: 'Students', misinformationParadigm: 'Standard', delayOfMisinformation: 'Short', noOfMisleadingDetails: 2, test: 'CON'
    }, { experiment: 'Bl98-Ex2', numberOfParticpants: 55 , typeOfParticipants: 'Students', misinformationParadigm: 'Standard', delayOfMisinformation: 'Short', noOfMisleadingDetails: 2, test: 'CON'}];

    $scope.log = function(){
      console.log($scope.items);
    };

    $scope.addInterpretation = function(){

    };
    $scope.updateMetaAnalysis = function(){
      console.log(metaAnalysis._id);
      $scope.metaAnalysis.title = "updated yo";
      metaAnalyses.update(metaAnalysis._id, $scope.metaAnalysis);
  };

  $scope.addStudy = function(){
    console.log($scope.items);
  };
}
]);

app.controller('MetaAnalysesCtrl', [
  '$scope', 'metaAnalyses',
  function($scope, metaAnalyses) {
    $scope.metaAnalyses = metaAnalyses.data;
    $scope.newMetaAnalysis = function() {
      metaAnalyses.create({
        title: $scope.title,
        description: $scope.description,
        owner: "1"
      });
      $scope.title = '';
      $scope.description = '';
    };
  }
]);
