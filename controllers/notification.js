'use strict';
angular.module('myApp.notification', ['ngRoute', 'ui.dateTimeInput']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/notification/:id', {
        templateUrl: 'views/notification.html',
    }).when('/notification', {
        templateUrl: 'views/notification.html',
    });
}]).controller('NotificationCtrl', ['$scope', '$location', '$routeParams', 'UserNotificationService', function($scope, $location, $routeParams, UserNotificationService) {

    var param = $routeParams.id;
    if (param) {
        UserNotificationService.getNotification(param).then(function(notification) {
            $scope.notification = notification;
            $scope.dateRangeStart = $scope.notification.data[0].validFrom;
            $scope.dateRangeEnd = $scope.notification.data[0].validTill;
        });
    }
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

    $scope.update = function(notification) {
        $scope.notificationData = {};
        $scope.appCodes = [];
        $scope.callToAction = [];
        $scope.appCodefield = {};
        $scope.appCodefieldsAll = {};
        $scope.notificationData._id = notification.data[0]._id;
        $scope.notificationData.campaign = notification.data[0].campaign;
        $scope.notificationData.shortTxt = notification.data[0].shortTxt;
        $scope.notificationData.imgURL = notification.data[0].imgURL;
        $scope.notificationData.longTxt = notification.data[0].longTxt;
        $scope.notificationData.sequence = notification.data[0].sequence;
        $scope.notificationData.type = notification.data[0].type;
        $scope.notificationData.validFrom = $scope.dateRangeStart;
        $scope.notificationData.validTill = $scope.dateRangeEnd;
        $scope.notificationData.memberId = notification.data[0].memberId;
        $scope.notificationData.memberEmail = notification.data[0].memberEmail;
        $scope.appCodefield.text = notification.data[0].appCodes[0].callToAction[0].text;
        $scope.appCodefield.link = notification.data[0].appCodes[0].callToAction[0].link;
        $scope.appCodefield.target = notification.data[0].appCodes[0].callToAction[0].target;
        $scope.callToAction.push($scope.appCodefield);
        $scope.appCodefieldsAll.appCode = notification.data[0].appCodes[0].appCode;
        $scope.appCodefieldsAll.callToAction = $scope.callToAction;
        $scope.appCodes.push($scope.appCodefieldsAll);
        $scope.notificationData.flag = 'N';
        $scope.notificationData.from = "dashboard";
        $scope.notificationData.appCodes = $scope.appCodes;
        UserNotificationService.updateNotification($scope.notificationData);
        swal("Done!", "Message updated successfully", "success");
    }

    $scope.fetchMemberId = function() {
        var memberEmail = $scope.notification.data[0].memberEmail;
        UserNotificationService.fetchMemberIdFromEmail(memberEmail).then(function(res) {
            if (res.data._id) {
                $scope.notification.data[0].memberId = res.data.memberId;
            } else {
                $scope.notification.data[0].memberId = null;
            }
        }).catch(function(err) {
            console.log(err);
        })
    }
    $scope.show = true;
    $scope.showWarning = function() {
        $scope.show = true;
    }
    $scope.limmiter = function() {
        $scope.sequence = $scope.notification.data[0].sequence;
        console.log($scope.sequence);
        if ($scope.sequence == undefined) {
            $scope.notification.data[0].sequence = null;
            swal(
                'Oops...',
                'NOTE: 99 is largest permissible value!',
                'warning'
            )

        }
        if ($scope.sequence == 0) {
            $scope.notification.data[0].sequence = null;
            swal(
                'Oops...',
                'NOTE: Your selection should be grater than zero',
                'warning'
            )

        }
    }
}]);
