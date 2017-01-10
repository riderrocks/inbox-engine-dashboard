'use strict';

var inboxUrl = 'http://172.16.65.7:6633';

var app = angular.module('myApp', ['ngRoute', 'myApp.dashboard', 'myApp.createCampaign', 'myApp.createUser', 'myApp.listAnnouncements', 'myApp.listNotifications', 'myApp.editAnnouncement', 'myApp.editNotification', 'myApp.viewCampaigns','myApp.resetPassword']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/viewCampaigns'
    });
}]).constant('CONFIG', {
    INBOX: {
        baseUrl: inboxUrl
    }
});
