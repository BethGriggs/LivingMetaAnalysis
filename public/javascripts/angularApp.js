var app = angular.module('livingmetaanalysis', ['ui.router']);

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
        controller: 'StudyCtrl',
        resolve: {
          postPromise: ['studies', function(studies) {
            return studies.getAll();
          }]
        }
      })
      .state('studies/create', {
        url: '/studies/create',
        templateUrl: '/studies/create.html',
        controller: 'StudyCtrl',
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
      .state('studyExperiments', {
        url: '/studies/:id/experiments',
        templateUrl: '/experiments.html',
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
    return $http.get('api/studies/' + id).then(function(res) {
      o.studies.push(res.data);
    })
  };

  o.getExperiments = function(id) {
    return $http.get('api/studies/' + id + '/experiments').then(function(res) {
      o.studies.push(res.data);
    })
  };
  return o;
}]);

/* Controllers */
app.controller('StudyCtrl', [
  '$scope', 'studies',
  function($scope, studies) {
    $scope.studies = studies.studies;

    $scope.addStudy = function() {
      studies.create({
        title: $scope.title,
        link: $scope.link,
      });
      $scope.title = '';
      $scope.author = '';
      $scope.year = '';
    };
  }
]);
