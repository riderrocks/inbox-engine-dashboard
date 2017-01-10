'use strict';
angular.module('myApp.userLogin', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/authUser', {
        templateUrl: 'views/userLogin.html',
    });
}]).controller('UserLoginCtrl', ['$scope', '$location', 'AuthenticationService', function($scope, $location, AuthenticationService) {

    $scope.user = {};
    $scope.alertFlag = false;
    $scope.alertMsg = '';

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

    $scope.authUser = function(user) {

        if ($scope.user.email == null || $scope.user.password == null) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'email and password cannot be blank';
            return false;
        }

        $scope.validateEmail($scope.user.email);

        if ($scope.user.password.length < 6) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'password has be of minimum 6 characters';
        }

        if (!$scope.alertFlag) {
            AuthenticationService.authUser(user).then(function(response) {
                if (response.data.status.httpResponseCode == 200) {
                    var authToken = response.data.data.token;
                    if (authToken) {
                        AuthenticationService.setToken(authToken);
                        $location.path('/viewCampaigns');
                    }
                    $scope.user = {};
                    swal({
                        title: "Done!",
                        text: "User Login successfull",
                        type: "success",
                        timer: 1000,
                        showConfirmButton: false
                    });
                }

                if (response.data.status.httpResponseCode == 400) {
                    swal("User not found!", "Please check your creddentials", "error");
                }
            });
        }
    }
}]);
