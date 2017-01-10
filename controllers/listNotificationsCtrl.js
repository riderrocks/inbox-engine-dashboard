'use strict';
angular.module('myApp.listNotifications', ['ngRoute','ui.bootstrap.datetimepicker']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/listNotifications', {
        templateUrl: 'views/listNotifications.html',
    });
}]).controller('listNotificationsCtrl', ['$scope', '$location', 'MessageService', function($scope, $location, MessageService) {
    MessageService.getAllNotifications().then(function(notification) {
        $scope.notifications = notification;
    });
}]);
