'use strict';
angular.module('myApp.createUser', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/createUser', {
        templateUrl: 'views/createUser.html',
    });
}]).controller('CreateUserCtrl', ['$scope', 'UserNotificationService', function($scope, UserNotificationService) {

    $scope.user = {};
    $scope.alertFlag = false;
    $scope.alertMsg = '';

    UserNotificationService.getRoles().then(function(role) {
        $scope.roles = role.data;
    });

    $scope.validateEmail = function(email) {
        var re = /^[a-z0-9](\.?[a-z0-9]){5,}@bookmyshow\.com$/;
        if (!(re.test(email))) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'please specify a valid email @bookmyshow.com';
        } else {
            $scope.alertFlag = false;
            $scope.alertMsg = '';
        }
        return re.test(email);
    };

    $scope.createUser = function(user) {

        if ($scope.user.firstName == null || $scope.user.lastName == null || $scope.user.email == null || $scope.user.phone == null || $scope.user._userRole == undefined) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'Oops! Fill all mandatory fields please';
            return;
        }

        var validateEmail = $scope.validateEmail($scope.user.email);
        if (!validateEmail) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'please specify a valid email address';
        } else {
            $scope.alertFlag = false;
            $scope.alertMsg = '';
        }

        if ($scope.user.phone.length < 10) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'mobile number has be of 10 characters';
        }

        if (!$scope.alertFlag) {
            UserNotificationService.createUser(user).then(function(response) {
                if (response.data.status.httpResponseCode == 200) {
                    $scope.user = {};
                    swal("Done!", "User created successfully", "success");
                } 

                if(response.data.status.httpResponseCode == 400 && response.data.error.code == 11000) {
                	swal("Oops!", "Email id already exists", "error");
                }
            });
        }
    }
}]);
