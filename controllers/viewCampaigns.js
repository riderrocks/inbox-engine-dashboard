'use strict';
angular.module('myApp.viewCampaigns', ['ngRoute', 'angularUtils.directives.dirPagination']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/viewCampaigns', {
        templateUrl: 'views/viewCampaigns.html',
    });
}]).controller('ViewCampaignsCtrl', ['$scope', 'UserNotificationService', function($scope, UserNotificationService) {

    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.currentTime = new Date().toISOString();

    $scope.state = {
        "campaignState": "all",
        "campaignStatus": ['all', 'scheduled', 'running', 'completed', 'stopped']
    };

    UserNotificationService.getAllCampaigns($scope.state.campaignState).then(function(campaign) {
        $scope.campaigns = campaign;
    });

    $scope.getAllCampaigns = function(state) {
        UserNotificationService.getAllCampaigns(state).then(function(campaign) {
            $scope.campaigns = campaign;
        });
    }

    $scope.stopCampaign = function(campaign) {
        if (campaign.masterId === '') {
            campaign.flag = 'A';
        } else if (campaign.memberEmail != null) {
            campaign.flag = 'N';
        }
        UserNotificationService.stopCampaign(campaign);
    }
}]).controller('OtherController', ['$scope', function($scope) {
    $scope.pageChangeHandler = function(num) {
        console.log('going to page ' + num);
    }
}]);
