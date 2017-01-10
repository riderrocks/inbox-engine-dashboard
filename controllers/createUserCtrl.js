'use strict';
angular.module('myApp.createUser', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/createUser', {
        templateUrl: 'views/createUser.html',
    });
}]).controller('CreateUserCtrl', ['$scope', '$location', 'AuthenticationService', function($scope, $location, AuthenticationService) {

    if (!AuthenticationService.getToken()) {
        $location.path('/authUser');
        return;
    }
    
    $scope.user = {};
    $scope.alertFlag = false;
    $scope.alertMsg = '';

    AuthenticationService.getRoles().then(function(role) {
        $scope.roles = role.data;
        var roles = $scope.roles;
        for (var i=0; i < roles.data.length; i++) {
            localStorage.setItem(roles.data[i]._id,roles.data[i].roleName);
        }
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

        $scope.validateEmail($scope.user.email);
        
        if ($scope.user.phone.length < 10) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'mobile number has be of 10 characters';
        }

        if (!$scope.alertFlag) {
            AuthenticationService.createUser(user).then(function(response) {
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
