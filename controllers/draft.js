'use strict';
angular.module('myApp.draft', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/draft', {
        templateUrl: 'views/draft.html',
        controller: 'DraftCtrl'
    });
}]).controller('DraftCtrl', ['$scope', '$location', function($scope, $location) {
   
}]);
