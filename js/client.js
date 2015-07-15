
var DGU = angular.module('dgu', ['ngRoute']);

// configure routes
DGU.config(function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl : 'pages/home.html',
            controller  : 'mainController'
        })
        .when('/dataset', {
            templateUrl : 'pages/dataset-list.html',
            controller  : 'datasetListController'
        })
        .when('/dataset/:datasetName', {
            templateUrl: 'pages/dataset.html',
            controller: 'datasetController'
        })
});

DGU.factory('searchIndex', function ($http) {
    var promise;
    var searchIndex = {
        async: function() {
            if ( !promise ) {
                promise = $http.get('/search-index.json').then(function (response) {
                    return response.data;
                });
            }
            // Return the promise to the controller
            return promise;
        }
    };
    return searchIndex;
});

DGU.factory('mapping', function ($http) {
    var promise;
    var mapping = {
        async: function() {
            if ( !promise ) {
                promise = $http.get('/dataset-map.json').then(function (response) {
                    return response.data;
                });
            }
            // Return the promise to the controller
            return promise;
        }
    };
    return mapping;
});


DGU.controller('mainController', function($scope, searchIndex, mapping) {
    // create a message to display in our view
    $scope.message = 'DGU static home page';
    searchIndex.async().then(function(data) {
        $scope.loadedIndex = data;
    });
    mapping.async().then(function(data) {
        $scope.mapping = data;
    });
});

DGU.controller('datasetListController', function($scope, searchIndex, mapping) {
    $scope.searchButton = {};
    $scope.searchButton.doClick = function(item, event) {

        searchIndex.async().then(function(data) {
            $scope.loadedIndex = data;
        });
        mapping.async().then(function(data) {
            $scope.mapping = data;
        });


        if($scope.index != undefined) {
            var results = $scope.index.search($scope.query);
        }
        else {
            $scope.index = lunr.Index.load($scope.loadedIndex);
            var results = $scope.index.search($scope.query);
        }

        $scope.datasets = [];
        results.forEach(function(dataset) {
            $scope.datasets.push({name: $scope.mapping[dataset.ref].name, title: $scope.mapping[dataset.ref].title});
        });
    }

});

DGU.controller('datasetController', function($scope, $routeParams, $http) {
    $http.get('/dataset/' + $routeParams.datasetName + '.json')
        .then(function(res){
            $scope.dataset = res.data;
        });
});

function getIdFromName(name, mapping) {
    for (var id in mapping) {
        if (mapping[id].name == name) {
           return id;
        }
    }
}