var authenticationService = app.service('AuthenticationService', ['$q', '$http', '$location', 'CONFIG', function($q, $http, $location, CONFIG) {
    this.baseUrl = CONFIG.INBOX.baseUrl;
    var user = '';

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
        localStorage.removeItem('Admin');
        $location.path('/authUser');
    }

    this.checkUserRole = function() {
        var userRoleId = localStorage.getItem('_userRole');
        if (userRoleId == localStorage.getItem('Admin')) {
            return 'Admin';
        }
    }

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
            headers: { 'x-access-token': token },
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
            headers: { 'x-access-token': token }
        }).then(function successCallback(response) {
            localStorage.setItem("_userRole", response.data.data._userRole);
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
