var authenticationService = app.service('AuthenticationService', ['$q', '$rootScope', '$sessionStorage', '$http', '$location', 'CONFIG', function($q,  $rootScope, $sessionStorage, $http, $location, CONFIG) {
    this.baseUrl = CONFIG.INBOX.baseUrl;
    var user = '';

    /* START - permission-based-auth-system-in-angularjs*/
    // var auth = {};

    // auth.init = function() {
    //     if (auth.isLoggedIn()) {
    //         $rootScope.user = currentUser();
    //     }
    // };

    // auth.checkPermissionForView = function(view) {
    //     if (!view.requiresAuthentication) {
    //         return true;
    //     }
    // };

    // var userHasPermissionForView = function(view) {
    //     if (!auth.isLoggedIn()) {
    //         return false;
    //     }

    //     if (!view.permissions || !view.permissions.length) {
    //         return true;
    //     }

    //     return auth.userHasPermission(view.permissions);
    // };

    // auth.userHasPermission = function(permissions) {
    //     if (!auth.isLoggedIn()) {
    //         return false;
    //     }

    //     var found = false;
    //     angular.forEach(permissions, function(permission, index) {
    //         if ($sessionStorage.user.user_permissions.indexOf(permission) >= 0) {
    //             found = true;
    //             return;
    //         }
    //     });

    //     return found;
    // };

    // auth.currentUser = function() {
    //     return $sessionStorage.user;
    // };

    // auth.isLoggedIn = function() {
    //     return $sessionStorage.user != null;
    // };

    // return auth;

    /* END - permission-based-auth-system-in-angularjs*/

    this.getToken = function() {
        if (user == '') {
            user = localStorage.getItem('userToken');
        }
        return user;
    }

    this.setToken = function(value) {
        localStorage.setItem('userToken', value);
        user = value;
    }

    this.logoutUser = function() {
        // loginObj.$unauth();
        user = '';
        localStorage.removeItem('userToken');
        localStorage.removeItem('_userRole');
        localStorage.removeItem('Admin');
         delete $sessionStorage.user;
        delete $rootScope.user;
        $location.path('/login');
    }

    // this.checkUserRole = function() {
    //     var userRoleId = localStorage.getItem('_userRole');
    //     if (userRoleId == localStorage.getItem('Admin')) {
    //         return 'Admin';
    //     }
    // }

    this.getRoles = function() {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: this.baseUrl + "/roles"
        }).then(function successCallback(response) {
            var roles = response;
            defer.resolve(roles);
        });
        return defer.promise;
    }

    this.createUser = function(user) {
        var defer = $q.defer();
        $http({
            method: 'POST',
            url: this.baseUrl + "/users",
            data: user
        }).then(function successCallback(response) {
            defer.resolve(response);
        }, function errorCallback(response) {
            console.log(response);
        });
        return defer.promise;
    }
    this.getUsers = function() {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: this.baseUrl + "/users",
        }).then(function successCallback(response) {
            defer.resolve(response);
        }, function errorCallback(response) {
            console.log(response);
        });
        return defer.promise;
    }

    this.authUser = function(user) {
        var defer = $q.defer();
        $http({
            method: 'POST',
            url: this.baseUrl + "/users/login",
            data: user
        }).then(function successCallback(response) {
            $sessionStorage.user = response.data.data;
            $rootScope.user = $sessionStorage.user;
            defer.resolve(response);
        }, function errorCallback(response) {
            console.log(response);
        });
        return defer.promise;
    }

    this.resetPassword = function(user, token) {
        var defer = $q.defer();
        $http({
            method: 'PUT',
            url: this.baseUrl + "/users/resetPassword",
            headers: {
                'x-access-token': token
            },
            data: user
        }).then(function successCallback(response) {
            defer.resolve(response);
        }, function errorCallback(response) {
            defer.reject(response);
        });
        return defer.promise;
    }

    this.getUserDetails = function(token) {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: this.baseUrl + "/users/me",
            headers: {
                'x-access-token': token
            }
        }).then(function successCallback(response) {
            defer.resolve(response.data.data);
        }, function errorCallback(response) {
            console.log(response);
        });
        return defer.promise;
    }

    this.activeDeactiveUser = function(user) {
        var defer = $q.defer();
        $http({
            method: 'PUT',
            url: this.baseUrl + "/users/activeDeactiveUser",
            data: user
        }).then(function successCallback(response) {
            defer.resolve(response);
        }, function errorCallback(response) {
            defer.reject(response);
        });
        return defer.promise;
    }
}]);
