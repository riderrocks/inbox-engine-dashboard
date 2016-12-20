'use strict';

var inboxUrl = 'https://testinbox.bms.bz/backend';

var app = angular.module('myApp', ['ngRoute', 'myApp.dashboard', 'myApp.new', 'myApp.scheduled', 'myApp.sent', 'myApp.listAnnouncements', 'myApp.listNotifications', 'myApp.announcement', 'myApp.notification']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/dashboard'
    });
}]).constant('CONFIG', {
    INBOX: {
        baseUrl: inboxUrl
    }
});
