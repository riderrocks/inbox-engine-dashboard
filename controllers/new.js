'use strict';
angular.module('myApp.new', ['ngRoute', 'kendo.directives', 'ui.bootstrap']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/new', {
        templateUrl: 'views/new.html',
    });
}]).controller('NewCtrl', ['$scope', '$window', '$location', 'UserNotificationService', function($scope, $window, $location, UserNotificationService) {

    UserNotificationService.getAllRegionCodes().then(function(regionCode) {
        $scope.selectOptions = {
            dataSource: {
                data: regionCode.data
            }
        };
    });

    $scope.endDateBeforeRender = endDateBeforeRender;
    $scope.endDateOnSetTime = endDateOnSetTime;
    $scope.startDateBeforeRender = startDateBeforeRender;
    $scope.startDateOnSetTime = startDateOnSetTime;

    function startDateOnSetTime() {
        $scope.$broadcast('start-date-changed');
    }

    function endDateOnSetTime() {
        $scope.$broadcast('end-date-changed');
    }

    function startDateBeforeRender($dates) {
        if ($scope.dateRangeEnd) {
            var activeDate = moment($scope.dateRangeEnd);
            $dates.filter(function(date) {
                return date.localDateValue() >= activeDate.valueOf()
            }).forEach(function(date) {
                date.selectable = false;
            })
        }
    }

    function endDateBeforeRender($view, $dates) {
        if ($scope.dateRangeStart) {
            var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');

            $dates.filter(function(date) {
                return date.localDateValue() <= activeDate.valueOf()
            }).forEach(function(date) {
                date.selectable = false;
            })
        }
    }

    $scope.create = function(announcement) { 
        $scope.appCodes = [];
        $scope.callToAction = [];
        $scope.appCodefieldsAll = {};
        $scope.callToAction.push($scope.appCodefield);
        $scope.appCodefieldsAll.appCode = $scope.appCodefield.appCode;
        $scope.appCodefieldsAll.callToAction = $scope.callToAction;
        $scope.appCodes.push($scope.appCodefieldsAll);
        announcement.flag = 'A';
        announcement.from = 'cms';
        announcement.validFrom = $scope.dateRangeStart;
        announcement.validTill = $scope.dateRangeEnd;
        announcement.appCodes = $scope.appCodes;
        UserNotificationService.createAnnouncement(announcement); 
    }

}]);
