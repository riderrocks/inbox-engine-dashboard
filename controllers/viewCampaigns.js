'use strict';
angular.module('myApp.viewCampaigns', ['ngRoute', 'angularUtils.directives.dirPagination']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/viewCampaigns', {
        templateUrl: 'views/viewCampaigns.html',
    });
}]).controller('ViewCampaignsCtrl', ['$scope', '$location', 'UserNotificationService', function($scope, $location, UserNotificationService) {
    $scope.state = {
        "campaignState": "all",
        "campaignStatus": ['all', 'scheduled', 'running', 'completed', 'stopped']
    };

    UserNotificationService.getAllCampaigns($scope.state.campaignState).then(function(campaign) {
        $scope.campaigns = campaign;
        console.log($scope.campaigns);
    });

    $scope.getAllCampaigns = function(state) {
        UserNotificationService.getAllCampaigns(state).then(function(campaign) {
            $scope.campaigns = campaign;
            console.log($scope.campaigns);
        });
    }

    $scope.currentPage = 1;
    $scope.pageSize = 10;

}]).controller('OtherController', ['$scope', function($scope) {
    $scope.pageChangeHandler = function(num) {
        console.log('going to page ' + num);
    }
}]);
