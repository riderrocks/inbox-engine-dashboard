'use strict';
angular.module('myApp.resetPassword', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/resetPassword', {
        templateUrl: 'views/resetPassword.html',
    });
}]).controller('ResetPassowrdCtrl', ['$scope', 'UserNotificationService', function($scope, UserNotificationService) {

    $scope.user = {};
    $scope.alertFlag = false;
    $scope.alertMsg = '';

    $scope.validatePassword = function(user) {
        if ($scope.user.newPassword || $scope.user.confirmPassword || $scope.user.oldPassword) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'Oops! Fill all mandatory fields please';
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
        if ($scope.user.newPassword || $scope.user.confirmPassword || $scope.user.oldPassword) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'Oops! Fill all mandatory fields please';
            return;
        }
        var validatePassword = validatePassword(user);
        if (!validatePassword) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'Confirm password should be same as new password';
        } else {
            $scope.alertFlag = false;
            $scope.alertMsg = '';
        }
        if (!$scope.alertFlag) {
        	//var token=services.getToken();
            UserNotificationService.resetPassword(user,token).then(function(response) {
                if (response.data.status.httpResponseCode == 200) {
                    $scope.user = {};
                    swal("Done!", "Password updated successfully", "success");
                }

                if (response.data.status.httpResponseCode == 400 && response.data.error.code == 11000) {
                    swal("Oops!", "Something went wrong", "error");
                }
            });
        }
    };
}]);
