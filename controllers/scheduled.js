'use strict';
angular.module('myApp.scheduled', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/scheduled', {
        templateUrl: 'views/scheduled.html',
    });
}]).controller('ScheduledCtrl', ['$scope', '$location', '$q', '$timeout', function($scope, $location, $q, $timeout) {

}]);
