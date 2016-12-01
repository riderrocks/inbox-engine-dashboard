'use strict';
angular.module('myApp.sent', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/sent', {
        templateUrl: 'views/sent.html',
    });
}]).controller('SentCtrl', ['$scope', '$location', 'UserNotificationService', function($scope, $location, UserNotificationService) {
    
    var notificationCount = UserNotificationService.getAllNotifications().then(function(notification) {
        $scope.notifications = notification;
    });

    var announcementCount = UserNotificationService.getAllAnnouncements().then(function(announcement) {
        $scope.announcements = announcement;
    });
}]);
