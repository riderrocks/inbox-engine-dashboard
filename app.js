'use strict';

var inboxUrl = 'http://172.16.66.81:6633';

var app = angular.module('myApp', ['ngRoute', 'angularUtils.directives.dirPagination', 'kendo.directives', 'ui.dateTimeInput', 'ui.bootstrap', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache']).config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/login', {
            templateUrl: 'views/userLogin.html',
        })
        .when('/createCampaign', {
            templateUrl: 'views/createCampaign.html',
        })
        .when('/announcement/:id', {
            templateUrl: 'views/editAnnouncement.html',
        })
        .when('/notification/:id', {
            templateUrl: 'views/editNotification.html',
        })
        .when('/createUser', {
            templateUrl: 'views/createUser.html',
            requiresAuthentication: true,
            permissions: ["administration"]
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
});
