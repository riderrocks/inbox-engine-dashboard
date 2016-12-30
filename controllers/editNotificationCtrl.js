'use strict';
angular.module('myApp.editNotification', ['ngRoute', 'ui.dateTimeInput']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/notification/:id', {
        templateUrl: 'views/editNotification.html',
    });
}]).controller('NotificationCtrl', ['$scope', '$location', '$routeParams', 'UserNotificationService', function($scope, $location, $routeParams, UserNotificationService) {

    var param = $routeParams.id;
    
    if (param) {
        UserNotificationService.getNotification(param).then(function(notification) {
            $scope.notification = notification.data[0];
            $scope.dateRangeStart = $scope.notification.validFrom;
            $scope.dateRangeEnd = $scope.notification.validTill;
        });
    }

    $scope.selectType = {
        "systemTypeValue": "CMS Announcement",
        "systemTypeValues": ['CMS Announcement', 'CMS Notification'],
        "appCodeTypeValue": "WEBIN",
        "appCodeTypeValues": ['WEBIN', 'MOBAND2', 'WEB', 'WEBTOUCH', 'MOBIOS3', 'MOBWIN10'],
        "targetTypeValue": "New Window",
        "targetTypeValues": ['New Window', 'Same Window'],
        "messageCardTypeValue": "PlainText",
        "messageCardTypeValues": ["PlainText", "PlainText with CTA"]
    };

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

    $scope.showWarning = function() {
        $scope.show = true;
    }

    $scope.limmiter = function() {
        $scope.sequence = $scope.notification.sequence;
        if ($scope.sequence == undefined) {
            $scope.notification.sequence = null;
            swal('Oops...', 'NOTE: 5 is largest permissible value!', 'warning');
        }
        if ($scope.sequence == 0) {
            $scope.notification.sequence = null;
            swal('Oops...', 'NOTE: Your selection should be greater than zero', 'warning');
        }
    }

    $scope.fetchMemberId = function() {
        var memberEmail = $scope.notification.memberEmail;
        UserNotificationService.fetchMemberIdFromEmail(memberEmail).then(function(res) {
            if (res.data._id) {
                $scope.notification.memberId = res.data.memberId;
            } else {
                $scope.notification.memberId = null;
            }
        }).catch(function(err) {
            console.log(err);
        })
    }

    $scope.update = function(notification) {
        $scope.notificationData = {};
        $scope.appCodes = [];
        $scope.callToAction = [];
        $scope.appCodefield = {};
        $scope.appCodefieldsAll = {};

        if (notification.appCodes[0].callToAction[0].target == 'Same Window') {
            $scope.appCodefield.target = '_self';
        } else {
            $scope.appCodefield.target = '_blank';
        }

        $scope.notificationData._id = notification._id;
        $scope.notificationData.campaign = notification.campaign;
        $scope.notificationData.shortTxt = notification.shortTxt;
        $scope.notificationData.imgURL = notification.imgURL;
        $scope.notificationData.longTxt = notification.longTxt;
        $scope.notificationData.sequence = notification.sequence;
        $scope.notificationData.type = notification.type;
        $scope.notificationData.validFrom = $scope.dateRangeStart;
        $scope.notificationData.validTill = $scope.dateRangeEnd;
        $scope.notificationData.memberId = notification.memberId;
        $scope.notificationData.memberEmail = notification.memberEmail;
        $scope.appCodefield.text = notification.appCodes[0].callToAction[0].text;
        $scope.appCodefield.link = notification.appCodes[0].callToAction[0].link;
        $scope.appCodefield.target = notification.appCodes[0].callToAction[0].target;
        $scope.callToAction.push($scope.appCodefield);
        $scope.appCodefieldsAll.appCode = notification.appCodes[0].appCode;
        $scope.appCodefieldsAll.callToAction = $scope.callToAction;
        $scope.appCodes.push($scope.appCodefieldsAll);
        $scope.notificationData.flag = 'N';
        $scope.notificationData.from = "dashboard";
        $scope.notificationData.appCodes = $scope.appCodes;
        UserNotificationService.updateNotification($scope.notificationData);
    }
}]);
