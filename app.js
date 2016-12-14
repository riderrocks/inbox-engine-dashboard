'use strict';

var inboxUrl = 'http://172.16.65.3:6633';

var app = angular.module('myApp', ['ngRoute', 'myApp.header', 'myApp.dashboard', 'myApp.new', 'myApp.scheduled', 'myApp.sent', 'myApp.listAnnouncements', 'myApp.listNotifications', 'myApp.announcement', 'myApp.notification']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/dashboard'
    });
}]).constant('CONFIG', {
    INBOX: {
        baseUrl: inboxUrl
    }
});