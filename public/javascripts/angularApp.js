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

  o.addData = function(id, derivedData){
    return $http.put('/api/studies/' + id + "/derivedData", derivedData).then(function(res){
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
app.controller('StudyCtrl',['$scope', 'studies', 'study',
  function($scope, studies, study) {
    $scope.study = study;
    $scope.derivedData = study.derivedData;

    $scope.addStudyData = function(){
      var newDerivedData =  {
          value: $scope.value,
          property: $scope.property,
          comment: $scope.comment,
          addedBy: "1"
      };
      studies.addData(study._id,newDerivedData);
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

app.controller('StudiesCtrl', [ '$http',
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
      $http.get('/api/studies/tag/' + $scope.searchTerm).then(function(res){
        $scope.searchResults= res.data;
        return res.data;
      });
    };
  }
]);

app.controller('MetaAnalysisCtrl', [
  '$scope', '$http', 'metaAnalyses', 'metaAnalysis', 'hotRegisterer',
  function($scope, $http, metaAnalyses, metaAnalysis, hotRegisterer) {

    $scope.metaAnalysis = metaAnalysis;
    $scope.properties = ["numberOfParticipants", "typeOfParticipants"];
    $scope.colArray = [{
      title: "property"
    }, {
      title: "study1"
    }, {
      title: "study2"
    }];
    $scope.minSpareRows = 1;
    $scope.killMeNow = [
      ["numberOfParticipants", "1", "2"],
      ["3", "4"]
    ];

    // settings
    $scope.comments = true;

    var commentsArray;
    var studyArray = [{
      id: "study1",
      derivedData: [{
        property: "numberOfParticipants",
        value: 58,
        comment: "anpthereffddaf"
      }, {
        property: "typeOfParticipants",
        value: "STUDENT"
      }, {
        property: "aNewProperty",
        value: "value"
      }]
    }, {
      id: "study2",
      derivedData: [{
        property: "numberOfParticipants",
        value: 59
      }, {
        property: "typeOfParticipants",
        value: "STUDENT",
        comment: "HI THEREsdfrghjkl sdfghjkl; sdfghjk sdfghjkl asdfghjkl asdfghj"
      }, {
        property: "typeExample",
        value: "example",
        comment: "wtf"
      }]
    }, ];
    generateArray();
    $scope.settings = {
      comments: true,
      cell: commentsArray
    };

    function generateArray() {
      var testArray = [];
      commentsArray = [];
      for (var k = 0; k < $scope.properties.length; k++) {
        // property is property string
        var testRow = [];
        testRow.push($scope.properties[k]);
        // for all studies
        for (var i = 0; i < studyArray.length; i++) {
          // for all bits of derived data
          var foundProperty = false;
          for (var j = 0; j < studyArray[i].derivedData.length; j++) {
            if (studyArray[i].derivedData[j].property == $scope.properties[k]) {
              foundProperty = true;
              testRow.push(studyArray[i].derivedData[j].value);
              if (studyArray[i].derivedData[j].comment !== undefined) {
                var commentObject = {
                  row: j,
                  col: (i + 1),
                  comment: studyArray[i].derivedData[j].comment
                };
                commentsArray.push(commentObject);
              }
            }
          }
          if (!foundProperty) {
            testRow.push(null);
          }
        }
        testArray.push(testRow);
      }
      $scope.testArray = testArray;

      $scope.commentsArray = commentsArray;
    }
    $scope.addInterpretation = function() {
      $scope.properties.push("aNewProperty");
      generateArray();
      $scope.commentsArray = commentsArray;
    };

    $scope.updateMetaAnalysis = function() {
      //console.log(metaAnalysis._id);
      //$scope.metaAnalysis.title = "updated yo";
      //  metaAnalyses.update(metaAnalysis._id, $scope.metaAnalysis);
    };

    $scope.addStudy = function() {
      $scope.colArray.push({
        title: "newStudy"
      });
      var newStudyObj = {
        id: "newStudy",
        derivedData: [{
          property: "numberOfParticipants",
          value: 25,
          comment: "anpthereffddaf"
        }, {
          property: "typeOfParticipants",
          value: "STUDENT"
        }]
      };
      studyArray.push(newStudyObj);
      generateArray();
      $scope.commentsArray = commentsArray;
    };

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
