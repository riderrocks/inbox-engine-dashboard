'use strict';
angular.module('myApp.listUsers', ['ngRoute', 'angularUtils.directives.dirPagination']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/listUsers', {
        templateUrl: 'views/listUsers.html',
    });
}]).controller('ListUsersCtrl', ['$scope', '$window', '$location', 'MessageService', 'AuthenticationService', function($scope, $window, $location, MessageService, AuthenticationService) {

    if (!AuthenticationService.getToken()) {
        $location.path('/login');
        return;
    }

    $scope.currentPage = 1;
    $scope.pageSize = 10;

    AuthenticationService.getUsers().then(function(users) {
        for (var i = 0; i < users.data.data.length; i++) {
            if (users.data.data[i]._userRole == localStorage.getItem('Admin')) {
                users.data.data[i].role = 'Admin';
            } else if (users.data.data[i]._userRole == localStorage.getItem('CCTeam')) {
                users.data.data[i].role = 'CC Team';
            }else if(users.data.data[i]._userRole == localStorage.getItem('Member')){
                  users.data.data[i].role = 'Member';
            }
        }
          $scope.users = users.data;
    });

    $scope.activeDeactiveUser = function(users) {
        swal({
            title: "Are you sure?",
            text: "Please confirm do you want to change the user status!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, Change it!",
            closeOnConfirm: false
        }, function() {
            AuthenticationService.activeDeactiveUser(users).then(function(response) {
                if (response.data.status.httpResponseCode == 200) {
                    swal({
                        title: "Done!",
                        text: "User status changed successfully",
                        type: "success"
                    }, function() {
                        $window.location.reload();
                    });
                }

            }).catch(function(response) {
                swal("Oops!", "something went wrong", "error");
            });
        });
    }


}]).controller('OtherController', ['$scope', function($scope) {
    $scope.pageChangeHandler = function(num) {
        // console.log('going to page ' + num);
    }
}]);
