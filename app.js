'use strict';

var inboxUrl = 'http://172.16.65.7:6633';

var app = angular.module('myApp', ['ngRoute', 'ngResource', 'ngStorage', 'kendo.directives', 'ui.bootstrap', 'ngMaterial', 
	'angularUtils.directives.dirPagination', 
	'ui.dateTimeInput', 'ui.bootstrap.datetimepicker']).config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'views/userLogin.html',
        })
        .when('/createCampaign', {
            templateUrl: 'views/createCampaign.html',
            requiresAuthentication: true,
            permissions: ["announcement_create","notification_create"]
        })
        .when('/announcement/:id', {
            templateUrl: 'views/editAnnouncement.html',
            requiresAuthentication: true,
            permissions: ["announcement_edit"]
        })
        .when('/notification/:id', {
            templateUrl: 'views/editNotification.html',
            requiresAuthentication: true,
            permissions: ["notification_edit"]
        })
        .when('/createUser', {
            templateUrl: 'views/createUser.html',
            requiresAuthentication: true,
            permissions: ["user_create"]
        })
        .when('/profile', {
            templateUrl: 'views/userProfile.html',
            requiresAuthentication: true
        })
        .when('/dashboard', {
            templateUrl: 'views/dashboard.html',
            requiresAuthentication: true
        })
        .when('/viewCampaigns', {
            templateUrl: 'views/viewCampaigns.html',
            requiresAuthentication: true,
        })
        .otherwise({
            redirectTo: '/login'
        });
}]).constant('CONFIG', {
    INBOX: {
        baseUrl: inboxUrl
    }
}).run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {
    Auth.init();

    $rootScope.$on('$routeChangeStart', function (event, next) {
        if (!Auth.checkPermissionForView(next)) {
            event.preventDefault();
            alert('Not Authorized');
            // $location.path('/login');
        }
    });
}]);
