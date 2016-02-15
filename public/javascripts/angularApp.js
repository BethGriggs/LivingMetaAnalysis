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
        }})
      .state('studies/create', {
        url: '/studies/create',
        templateUrl: '/studies/create.html',
        controller: 'StudyCtrl',
        resolve: {
          postPromise: ['studies', function(studies) {
            return studies.getAll();
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
        return o;
      }]);


    // controllers
    app.controller('MainCtrl', [
      '$scope',
      function($scope) {

      }
    ]);

    // controllers
    app.controller('StudyCtrl', [
      '$scope', 'studies',
      function($scope, studies) {
        $scope.studies = studies.studies;
        $scope.addStudy = function() {
          studies.create({
            title: $scope.title,
            link: $scope.link,
          });
          alert($scope.studies);
          $scope.title = '';
          $scope.author = '';
          $scope.year = '';
        };
      }
    ]);
