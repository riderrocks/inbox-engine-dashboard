'use strict';
angular.module('myApp.createUser', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/createUser', {
        templateUrl: 'views/createUser.html',
    });
}]).controller('CreateUserCtrl', ['$scope', function($scope) {

    
}]);
