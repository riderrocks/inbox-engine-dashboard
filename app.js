'use strict';

var inboxUrl = 'http://172.16.66.81:6633';

var app = angular.module('myApp', ['ngRoute', 'myApp.dashboard', 'myApp.new', 'myApp.scheduled', 'myApp.sent', 'myApp.listAnnouncements', 'myApp.listNotifications', 'myApp.announcement', 'myApp.notification', 'myApp.viewCampaigns']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/dashboard'
    });
}]).constant('CONFIG', {
    INBOX: {
        baseUrl: inboxUrl
    }
});
