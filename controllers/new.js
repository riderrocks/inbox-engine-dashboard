'use strict';
angular.module('myApp.new', ['ngRoute', 'ui.bootstrap']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/new', {
        templateUrl: 'views/new.html',
        controller: 'NewCtrl'
    });
}]).controller('NewCtrl', ['$scope', '$window', '$location', function($scope, $window, $location) {
    $scope.tabIndex = 0;
    $scope.buttonLabel = "Next";

    $scope.tabs = [{
            title: "WHO",
            content: "WHO do you want to send this campaign to?",
            active: true
        }, {
            title: "WHEN",
            content: "WHEN do you want to schedule this campaign?"
        }, {
            title: "WHAT",
            content: "WHAT do you want to send?"
        }, {
            title: "OVERVIEW",
            content: "Campaign Overview"
        }

    ];

    $scope.proceed = function() {
        if ($scope.tabIndex !== $scope.tabs.length - 1) {
            $scope.tabs[$scope.tabIndex].active = false;
            $scope.tabIndex++
                $scope.tabs[$scope.tabIndex].active = true;
        }

        if ($scope.tabIndex === $scope.tabs.length - 1) {
            $scope.buttonLabel = "Finish";
        }

    };

    $scope.setIndex = function($index) {
        $scope.tabIndex = $index;
    }

}]);
