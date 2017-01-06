'use strict';

var inboxUrl = 'http://172.16.66.54:6633';

var app = angular.module('myApp', ['ngRoute', 'myApp.dashboard', 'myApp.createCampaign', 'myApp.sent', 'myApp.listAnnouncements', 'myApp.listNotifications', 'myApp.editAnnouncement', 'myApp.editNotification', 'myApp.viewCampaigns']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/viewCampaigns'
    });
}]).constant('CONFIG', {
    INBOX: {
        baseUrl: inboxUrl
    }
});
