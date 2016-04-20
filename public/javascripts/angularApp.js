var app = angular.module('livingmetaanalysis', ['ui.router', 'ngTagsInput']);

/**
/* App config
/**/
app.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: '/login.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('home');
          }
        }]
      })
      .state('register', {
        url: '/register',
        templateUrl: '/register.html',
        controller: 'AuthCtrl',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (auth.isLoggedIn()) {
            $state.go('home');
          }
        }]
      })
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'UserCtrl',
        onEnter: ['$state', 'auth', function($state, auth) {
          if (!auth.isLoggedIn()) {
            $state.go('login', {}, {
              reload: true
            });
          }
        }]
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
      .state('studies/search', {
        url: '/studies/search',
        templateUrl: 'studies/search.html',
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
      })
      .state('help', {
        url: '/help',
        templateUrl: 'help.html'
      })
      .state('api', {
        url: '/api',
        templateUrl: 'api.html'
            });
    $urlRouterProvider.otherwise('home');
  }
]);

/**
/* Auth service based on a tutorial
/* https://thinkster.io/mean-stack-tutorial
/* Manages users and JWT
/**/
app.factory('auth', ['$http', '$window', function($http, $window) {
  var auth = {};

  auth.saveToken = function(token) {
    $window.localStorage['livingmetaanalysis-token'] = token;
  };

  auth.getToken = function() {
    return $window.localStorage['livingmetaanalysis-token'];
  };

  auth.isLoggedIn = function() {
    var token = auth.getToken();

    if (token) {
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  auth.currentUser = function() {
    if (auth.isLoggedIn()) {
      var token = auth.getToken();
      var payload = JSON.parse($window.atob(token.split('.')[1]));

      return payload.username;
    }
  };

  auth.register = function(user) {
    return $http.post('/register', user).success(function(data) {
      auth.saveToken(data.token);
    });
  };

  auth.logIn = function(user) {
    return $http.post('/login', user).success(function(data) {
      auth.saveToken(data.token);
    });
  };

  auth.logOut = function() {
    $window.localStorage.removeItem('livingmetaanalysis-token');
  };
  return auth;
}]);

/* Services */

/**
/* Studies service
/* Provides methods to: create, get, getAll, update, and add data to a studues
/**/
app.factory('studies', ['$http', 'auth', function($http, auth) {

  var o = {
    studies: []
  };

  o.getAll = function() {
    return $http.get('/api/studies').success(function(data) {
      angular.copy(data, o.studies);
    });
  };

  o.create = function(study) {
    return $http.post('/api/studies', study, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }).success(function(data) {
      o.studies.push(data);
    });
  };

  o.get = function(id) {
    return $http.get('/api/studies/' + id).then(function(res) {
      return res.data;
    });
  };

  o.update = function(id, study) {
    return $http.put('/api/studies/' + id, study, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    }).then(function(res) {
      return res.data;
    });
  };

  o.addData = function(id, derivedData) {
    derivedData.addedBy = auth.currentUser;
    return $http.put('/api/studies/' + id + "/derivedData", derivedData, {
      headers: {
        Authorization: 'Bearer ' + auth.getToken()
      }
    });
  };

  return o;
}]);

/**
/* Meta-analysis service
/* Provides methods to: create, get, getAll, and update meta-analyses
/**/
app.factory('metaAnalyses', ['$http', 'auth',
  function($http, auth) {

    var o = {
      metaAnalyses: []
    };

    o.create = function(metaAnalysis) {
      return $http.post('/api/metaanalyses', metaAnalysis, {
        headers: {
          Authorization: 'Bearer ' + auth.getToken()
        }
      }).success(function(data) {
        o.metaAnalyses.push(data);
        return data;
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

    return o;
  }
]);

/* Controllers */

/**
/* Authentication controller
/* Provides methods for a user to register and log in
/**/
app.controller('AuthCtrl', [
  '$scope',
  '$state',
  'auth',
  function($scope, $state, auth) {
    $scope.user = {};

    // registers a new user
    $scope.register = function() {
      auth.register($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $state.go('home');
      });
    };

    // logs a user in
    $scope.logIn = function() {
      auth.logIn($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $state.go('home');
      });
    };
  }
]);

/**
/* Study controller
/* Provides methods to: add a derived data to a study
/**/
app.controller('StudyCtrl', ['auth', '$scope', '$state', 'studies', 'study',
  function(auth, $scope, $state, studies, study) {
    $scope.study = study;
    $scope.isLoggedIn = auth.isLoggedIn;

    $scope.addStudyData = function() {
      var newDerivedData = {
        value: $scope.value,
        property: $scope.property,
        comment: $scope.comment,
        addedBy: "1"
      };

      studies.addData(study._id, newDerivedData).success(function() {
        $scope.property = '';
        $scope.value = '';
        $scope.comment = '';
        $state.go($state.current, {}, {
          reload: true
        });
      });

    };
  }
]);

/**
/* Nav controller
/* Sets up the $scope for the navigation
/**/
app.controller('NavCtrl', [
  '$scope', '$state',
  'auth',
  function($scope, $state, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = function() {
      auth.logOut();
      $state.go('login', {}, {
        reload: true
      });
    };
  }
]);

/**
/* UserCtrl controller
/* Provides methods to: add a new study and search for studies
/**/
app.controller('UserCtrl', ['$http',
  '$scope', 'auth',
  function($http, $scope, auth) {
    $scope.user = auth.currentUser();

    // populates the users contributions
    $http.get('/api/user/' + auth.currentUser() + '/metaanalyses').success(function(data) {
      $scope.userMetaAnalyses = data;
    });

    $http.get('/api/user/' + auth.currentUser() + '/studies').success(function(data) {
      $scope.userStudies = data;
    });
  }
]);

/**
/* Studies controller
/* Provides methods to: add a new study and search for studies
/**/
app.controller('StudiesCtrl', ['$http', '$scope',
  '$state', 'auth', 'studies',
  function($http, $scope, $state, auth, studies) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.studies = studies.studies;

    $scope.addStudy = function() {
      var tagsArray = [];
      var i = 0;
      if ($scope.tags !== undefined) {
        for (i; i < $scope.tags.length; i++) {
          tagsArray.push($scope.tags[i].text);
        }
      }

      studies.create({
        identifier: $scope.identifier,
        title: $scope.title,
        author: [$scope.author],
        link: $scope.link,
        year: $scope.year,
        tags: tagsArray
      }).success(function(data) {
        // if state is meta-analysis reload state
        if ($state.current.name == 'metaanalyses/id') {
          $state.go($state.current, {}, {
            reload: true
          });
        } else {
          // else got to study that has been created
          $state.go('studies/id', {
            id: data._id
          }, {
            reload: true
          });
        }
      });

      //reset scopes
      $scope.identifier = '';
      $scope.title = '';
      $scope.author = '';
      $scope.year = '';
      $scope.link = '';
      $scope.tags = [];

    };

    $scope.search = function() {
      $http.get('/api/studies/tag/' + $scope.searchTerm).then(function(res) {
        $scope.searchResults = res.data;
        return res.data;
      });
    };
  }
]);

/**
/* MetaAnalysis controller
/* Provides methods to: add studies and properties to a meta-analysis, and add
/* data to a particular study
/**/
app.controller('MetaAnalysisCtrl', [
  '$http', '$scope', '$state', '$timeout', 'metaAnalyses', 'metaAnalysis', 'studies',
  function($http, $scope, $state, $timeout, metaAnalyses, metaAnalysis, studies) {
    $scope.metaAnalysis = metaAnalysis;
    $scope.properties = metaAnalysis.properties;
    $scope.studies = metaAnalysis.studies;

    // get suggested / existing properties
    var existingProperties = [];
    for (var i = 0; i < metaAnalysis.studies.length; i++) {
      var study = metaAnalysis.studies[i];
      for (var j = 0; j < study.derivedData.length; j++) {
        var currentProperty = study.derivedData[j].property;
        if (existingProperties.indexOf(currentProperty) < 0 && $scope.properties.indexOf(currentProperty) < 0) {
          existingProperties.push(currentProperty);
        }
      }
    }
    $scope.existingProperties = existingProperties;

    // toggles the new study form
    $scope.toggleNewStudyForm = function() {
      $scope.newStudyForm = !$scope.newStudyForm;
    };

    // adds a new property to the meta-analysis
    $scope.addPropertyToMetaAnalysis = function() {

      if ($scope.newProperty !== undefined) {
        metaAnalysis.properties.push($scope.newProperty);
        metaAnalyses.update(metaAnalysis._id, metaAnalysis);
      }
    };

    // adds study to meta-analysis
    $scope.addStudyToMetaAnalysis = function(study) {
      metaAnalysis.studies.push(study);
      metaAnalyses.update(metaAnalysis._id, metaAnalysis);
    };

    $scope.removeStudyFromMetaAnalysis = function(study) {
      var index = metaAnalysis.studies.indexOf(study);
      metaAnalysis.studies.splice(index, 1);
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
      };

      // Adds the new derived data to the specific study,
      // updates the Angular state if successful
      studies.addData($scope.study._id, newDerivedData).success(
        function(data) {
          $state.go($state.current, {}, {
            reload: true
          });
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

    // used to detect whether the study has had that property derived
    $scope.getStudyPropertyComment = function(study, property) {
      for (var i = 0; i < study.derivedData.length; i++) {
        if (study.derivedData[i].property == property) {
          return study.derivedData[i].comment;
        }
      }
      return '';
    };

    // adds a new study
    $scope.addNewStudy = function() {
      var tagsArray = [];
      if ($scope.tags.length) {
        for (var i = 0; i < $scope.tags.length; i++) {
          tagsArray.push($scope.tags[i].text);
        }
      }
      $http.post('/api/studies', {
        identifier: $scope.identifier,
        title: $scope.title,
        author: $scope.author,
        year: $scope.year,
        link: $scope.link,
        tags: tagsArray
      });
    };

    // checks if the study is in a meta-analysis
    $scope.studyInMetaAnalysis = function(study) {
      var i = 0;
      for (i; i < metaAnalysis.studies.length; i++) {
        if (study._id === metaAnalysis.studies[i]._id) {
          return true;
        }
      }
      return false;
    };
  }
]);

/**
/* MetaAnalyses controller
/* Provides methods to add a new meta-analysis
/**/
app.controller('MetaAnalysesCtrl', [
  '$scope', '$state', 'metaAnalyses',
  function($scope, $state, metaAnalyses) {
    $scope.metaAnalyses = metaAnalyses.data;

    // function to create a new meta analysis
    $scope.createMetaAnalysis = function() {
      // get tags from view
      var tagsArray = [];
      if ($scope.tags !== undefined) {
        for (var i = 0; i < $scope.tags.length; i++) {
          tagsArray.push($scope.tags[i].text);
        }
      }

      // creates a new meta-analysis
      metaAnalyses.create({
        title: $scope.title,
        description: $scope.description,
        owner: '1',
        tags: tagsArray
      });
      $scope.title = '';
      $scope.description = '';
      $scope.tags = [];

      // return to dashboard state
      $state.go('home', {}, {
        reload: true
      });
    };
  }
]);
