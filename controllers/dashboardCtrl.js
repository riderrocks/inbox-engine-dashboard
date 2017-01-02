'use strict';
angular.module('myApp.dashboard', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/dashboard', {
        templateUrl: 'views/dashboard.html',
    });
}]).controller('DashboardCtrl', ['$scope', '$location', '$timeout', function($scope, $location, $timeout) {
    $scope.isRouteActive = function(route) {
        var curRoute = $location.path();
        if (curRoute == '/dashboard') {
            $scope.routeName = 'Dashboard';
        } else if (curRoute == '/createCampaign') {
            $scope.routeName = 'New Message';
        } else if (curRoute == '/sent') {
            $scope.routeName = 'Sent Message';
        } else if (curRoute == '/scheduled') {
            $scope.routeName = 'Scheduled Message';
        } else if (curRoute == '/viewCampaigns') {
            $scope.routeName = 'View Campaigns';
        } else if (curRoute == '/listAnnouncements') {
            $scope.routeName = 'Listing Announcements';
        } else if (curRoute == '/listNotifications') {
            $scope.routeName = 'Listing Notifications';
        } else if (curRoute.indexOf('/announcement') > -1) {
            $scope.routeName = 'Edit Announcement';
        } else if (curRoute.indexOf('/notification') > -1) {
            $scope.routeName = 'Edit Notification';
        }
        return curRoute.match(route);
    }

    $scope.clock = "loading clock...";
    $scope.tickInterval = 1000;

    var tick = function() {
        $scope.clock = Date.now();
        $timeout(tick, $scope.tickInterval);
    }

    $scope.isRouteActive();
    $timeout(tick, $scope.tickInterval);
}]);
