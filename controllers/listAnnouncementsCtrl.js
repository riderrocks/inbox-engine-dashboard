'use strict';
angular.module('myApp.listAnnouncements', ['ngRoute','ui.bootstrap.datetimepicker']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/listAnnouncements', {
        templateUrl: 'views/listAnnouncements.html',
    });
}]).controller('listAnnouncementsCtrl', ['$scope', '$location', 'UserNotificationService', function($scope, $location, UserNotificationService) {
    UserNotificationService.getAllAnnouncements().then(function(announcement) {
        $scope.announcements = announcement;
    });
}]);
