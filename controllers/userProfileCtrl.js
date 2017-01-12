'use strict';
angular.module('myApp.userProfile', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/profile', {
        templateUrl: 'views/profile.html',
    });
}]).controller('ProfileCtrl', ['$scope', 'MessageService', 'AuthenticationService', function($scope, MessageService, AuthenticationService) {

    $scope.user = {};
    $scope.alertFlag = false;
    $scope.alertMsg = '';
    var token = AuthenticationService.getToken();
    AuthenticationService.getUserDetails(token).then(function(response) {
        // console.log(response);
        $scope.profile = response;
    });

    $scope.validatePassword = function(user) {
        if ($scope.user.newPassword == null || $scope.user.confirmPassword == null || $scope.user.oldPassword == null) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'Oops! Fill all mandatory fields please';
            return;
        }
        if ($scope.user.newPassword.length < 6) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'password has be of minimum 6 characters';
            return;
        }
        var result = angular.equals($scope.user.newPassword, $scope.user.confirmPassword);
        if (!result) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'Confirm password should be same as new password';
        } else {
            $scope.alertFlag = false;
            $scope.alertMsg = '';
        }

    };
    $scope.resetPassword = function(user) {
        if ($scope.user.newPassword == null || $scope.user.confirmPassword == null || $scope.user.oldPassword == null) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'Oops! Fill all mandatory fields please';
            return;
        }
        $scope.validatePassword(user);

        if (!$scope.alertFlag) {
            swal({
                title: "Are you sure?",
                text: "Please confirm do you want to change the password!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, Change it!",
                closeOnConfirm: false
            }, function() {
                AuthenticationService.resetPassword($scope.user, token).then(function(response) {
                if (response.data.status.httpResponseCode == 200) {
                    $scope.user = {};
                    swal("Done!", "Password updated successfully", "success");
                }

            }).catch(function(response) {
                swal("Oops!", "Current password is incorrect", "error");
            });
            });

            
        }
    };
}]);
