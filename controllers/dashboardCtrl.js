'use strict';

app.controller('DashboardCtrl', ['$scope', '$location', '$timeout', 'AuthenticationService', function($scope, $location, $timeout, AuthenticationService) {

    // $scope.userRole = '';

    if (!AuthenticationService.getToken()) {
        $location.path('/login');
        return;
    }

    $scope.userRole = AuthenticationService.checkUserRole();
    // if (userRole == 'Admin') {
    //     $scope.userRole = 'Admin';
    // }

    $scope.isRouteActive = function(route) {
        var curRoute = $location.path();
        if (curRoute == '/dashboard') {
            $scope.routeName = 'Dashboard';
        } else if (curRoute == '/createCampaign') {
            $scope.routeName = 'New Message';
        } else if (curRoute == '/createUser') {
            $scope.routeName = 'Create User';
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
        } else if (curRoute == '/resetPassword') {
            $scope.routeName = 'Reset Password';
        }else if(curRoute=='/profile'){
            $scope.routeName='Profile'
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

    $scope.logout = function() {
        swal({
            title: "Are you sure you want to logout?",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, log me out!",
            closeOnConfirm: true
        }, function() {
            AuthenticationService.logoutUser();
        });
    }
}]);
