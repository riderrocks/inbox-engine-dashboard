'use strict';

var inboxUrl = 'https://backend-inboxenginenotification.fwd.wf/';

var app = angular.module('myApp', ['ngRoute','myApp.header', 'myApp.dashboard', 'myApp.new', 'myApp.scheduled', 'myApp.sent']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.otherwise({
        redirectTo: '/dashboard'
    });
}]).constant('CONFIG', {
	INBOX : {
		baseUrl : inboxUrl
	}
});
