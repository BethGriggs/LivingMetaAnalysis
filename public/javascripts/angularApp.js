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
       });

    $urlRouterProvider.otherwise('home');
  }
]);


// controllers
app.controller('MainCtrl', [
'$scope',
function($scope){

}]);
