'use strict';

app.controller('CreateUserCtrl', ['$scope', '$location', 'AuthenticationService', function($scope, $location, AuthenticationService) {

    if (!AuthenticationService.getToken()) {
        $location.path('/login');
        return;
    }
    
    // if (Auth.userHasPermission(["administration"])){
    //     // some evil logic here
    //     var userName = Auth.currentUser().name;
    //     console.log(userName);
    //     // ...
    // }
 
    $scope.user = {};
    $scope.alertFlag = false;
    $scope.alertMsg = '';

    AuthenticationService.getRoles().then(function(role) {
        $scope.roles = role.data;
    });

    $scope.validateEmail = function(email) {
        var re = /^[a-z0-9](\.?[a-z0-9]){0,}@bookmyshow\.com$/;
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
