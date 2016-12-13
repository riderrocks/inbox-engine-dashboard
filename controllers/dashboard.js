'use strict';
angular.module('myApp.dashboard', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'views/dashboard.html',
        controller: 'DashboardCtrl'
    });
}]).controller('DashboardCtrl', ['$scope', '$location', function($scope, $location) {
    
    
}]);
