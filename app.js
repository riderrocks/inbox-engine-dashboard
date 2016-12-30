'use strict';

var inboxUrl = 'http://172.16.65.7:6633';

var app = angular.module('myApp', ['ngRoute', 'myApp.dashboard', 'myApp.new', 'myApp.sent', 'myApp.listAnnouncements', 'myApp.listNotifications', 'myApp.announcement', 'myApp.notification', 'myApp.viewCampaigns']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/viewCampaigns'
    });
}]).constant('CONFIG', {
    INBOX: {
        baseUrl: inboxUrl
    }
});
