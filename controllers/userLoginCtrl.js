'use strict';

app.controller('UserLoginCtrl', ['$scope', '$location', 'AuthenticationService', function($scope, $location, AuthenticationService) {

    $scope.user = {};
    $scope.alertFlag = false;
    $scope.alertMsg = '';

    // AuthenticationService.getRoles().then(function(role) {
    //     var roles = role.data;
    //     for (var i = 0; i < roles.data.length; i++) {
    //         localStorage.setItem(roles.data[i].roleName, roles.data[i]._id);
    //     }
    // });

    $scope.validateEmail = function(email, password) {
        var re = /^[a-z0-9](\.?[a-z0-9]){0,}@bookmyshow\.com$/;
        if (!(re.test(email))) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'please specify email @bookmyshow.com only';
        } else {
            $scope.validatePassword(password);
        }
        return re.test(email);
    };

    $scope.validatePassword = function(password) {
        if (password.length < 6) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'password has be of minimum 6 characters';
        } else {
            $scope.alertFlag = false;
            $scope.alertMsg = '';
        }
    }

    $scope.authUser = function(user) {
        if (user.email == null || user.password == '' || user.password == undefined) {
            $scope.alertFlag = true;
            $scope.alertMsg = 'email and password cannot be blank';
            return false;
        }

        $scope.validateEmail(user.email, user.password);

        if (!$scope.alertFlag) {
            AuthenticationService.authUser(user).then(function(response) {
                if (response.data.error.msg == "No valid user to login") {
                    swal("Sorry!", "No valid user to login", "error");
                }

                if (response.data.error.msg == "Invalid password") {
                    swal("Sorry!", "Please verify your password", "error");
                }

                if (response.data.status.httpResponseCode == 200) {
                    var authToken = response.data.data.token;
                    if (authToken) {
                        AuthenticationService.setToken(authToken);
                        // AuthenticationService.getUserDetails(authToken);
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
            });
        }
    }
}]);
