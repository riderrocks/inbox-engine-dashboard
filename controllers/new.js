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

    $scope.messageType = {
        name: 'announcement'
    };

    $scope.messageType.announcement = true;
    $scope.messageType.notification = false;

    $scope.toggleState = function(messageType) {
        if (messageType.name == 'announcement') {
            $scope.messageType.announcement = true;
            $scope.messageType.notification = false;
        } else if (messageType.name == 'notification') {
            $scope.messageType.notification = true;
            $scope.messageType.announcement = false;
        }
    }

    $scope.endDateBeforeRender = endDateBeforeRender;
    $scope.endDateOnSetTime = endDateOnSetTime;
    $scope.startDateBeforeRender = startDateBeforeRender;
    $scope.startDateOnSetTime = startDateOnSetTime;

    function startDateOnSetTime() {
        $scope.$broadcast('start-date-changed');
    }
    $scope.$on('start-date-changed', function(event, args) {
        $scope.dateChecker();
    });

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



    $scope.create = function(message) {
        $scope.appCodes = [];
        $scope.callToAction = [];
        $scope.appCodefieldsAll = {};
        $scope.callToAction.push($scope.appCodefield);
        $scope.appCodefieldsAll.appCode = $scope.appCodefield.appCode;
        $scope.appCodefieldsAll.callToAction = $scope.callToAction;
        $scope.appCodes.push($scope.appCodefieldsAll);
        message.from = 'cms';
        message.validFrom = $scope.dateRangeStart;
        message.validTill = $scope.dateRangeEnd;
        message.appCodes = $scope.appCodes;

        if ($scope.messageType.name == 'announcement') {
            message.flag = 'A';
            delete message.memberId;
            delete message.memberEmail;
            console.log(message);
        } else if ($scope.messageType.name == 'notification') {
            message.flag = 'N';
            delete message.regionCode;
            console.log(message);
        }
        UserNotificationService.createAnnouncement(message);
        $scope.message = {};
        $scope.dateRangeStart = null;
        $scope.dateRangeEnd = null;
        $scope.selectedIds = null;
        $scope.appCodefield.text = null;
        $scope.appCodefield.link = null;

        swal("Done!", "Message created successfully", "success");
    }

    $scope.limmiter = function() {
        $scope.sequence = $scope.message.Sequence;
        console.log($scope.sequence);
        if ($scope.sequence == undefined) {
            $scope.message.Sequence = null;
            swal(
                'Oops...',
                'NOTE: 99 is largest permissible value!',
                'error'
            )

        }
        if ($scope.sequence == 0) {
            $scope.message.Sequence = null;
            swal(
                'Oops...',
                'NOTE: Your selection should be grater than zero',
                'error'
            )

        }
    }

    $scope.dateChecker = function() {
        $scope.validFrom = new Date($scope.dateRangeStart);
        $scope.date = new Date();

        if ($scope.validFrom < $scope.date) {
            $scope.dateRangeStart = null;
            swal(
                'Oops...',
                'Valid From cannot be less than Present Date!',
                'warning'
            )

        }
    }

    $scope.checkCampaign = function() {
        var value = $scope.message.campaign;
        if ($scope.messageType.name === "announcement") {
            UserNotificationService.checkUniqueAnnouncementCampaign(value).then(function(response) {
                if ($scope.message.campaign !== null) {
                    if (response !== null) {
                        $scope.message.campaign = null;
                        swal(
                            'Oops...',
                            'Campaign name already Exists. Choose a new name!',
                            'warning'
                        )
                    }
                }
            });
        } else if ($scope.messageType.name == 'notification') {
            UserNotificationService.checkUniqueNotificationCampaign(value).then(function(response) {
                if ($scope.message.campaign !== null) {
                    if (response !== null) {
                        $scope.message.campaign = null;
                        swal(
                            'Oops...',
                            'Campaign name already Exists. Choose a new name!',
                            'warning'
                        )
                    }
                }
            });

        }
    }




    $scope.fetchMemberId = function() {

        var memberEmail = $scope.message.memberEmail;
        UserNotificationService.fetchMemberIdFromEmailId(memberEmail).then(function(response) {

            console.log(response);
            if (response.error == "No data exist") {
                $scope.message.memberEmail = null;
                $scope.message.memberId = null;
                swal('Oops...', 'No matching Email Id found.', 'warning');
            } else {
                $scope.message.memberId = response.memberId;
            }
        });

    }

}]);
