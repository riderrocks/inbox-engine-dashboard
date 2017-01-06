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
        console.log($scope.campaigns.data[0].appCodes);
        console.log($scope.campaigns.data[0].regionCode);

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
        swal({
            title: "Are you sure?",
            text: "You will not be able to reverse this back!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, stop it!",
            closeOnConfirm: false
        }, function() {
            UserNotificationService.stopCampaign(campaign);
        });
    }
}]).controller('OtherController', ['$scope', function($scope) {
    $scope.pageChangeHandler = function(num) {
        // console.log('going to page ' + num);
    }
}]);
