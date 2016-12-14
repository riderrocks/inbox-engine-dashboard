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
        $scope.appCodefield = {};
        swal("Done!", "Message created successfully", "success");
    }
    $scope.limmiter = function() {
        $scope.sequence = $scope.message.Sequence;
        if ($scope.sequence == undefined) {
            $scope.message.Sequence = null;
            swal(
                'Oops...',
                'NOTE: 99 is largest permissible value!',
                'error'
            )

        }
    }

    $scope.dateChecker = function() {
        $scope.validFrom = new Date($scope.dateRangeStart.setHours(0, 0, 0, 0));
        $scope.date = new Date().setHours(0, 0, 0, 0);

        if ($scope.validFrom < $scope.date) {
            $scope.dateRangeStart = null;
            swal(
                'Oops...',
                'Valid From cannot be less than Present Date!',
                'warning'
            )

        }
    }

    $scope.checkCampaign_A = function() {
        var value = $scope.announcement.campaign;
        console.log(value);
        UserNotificationService.checkUniqueCampaign(value).then(function(response) {

            if ($scope.announcement.campaign !== null) {
                if (response !== null) {
                    $scope.announcement.campaign = null;
                    swal(
                        'Oops...',
                        'Campaign name already Exists. Choose a new name!',
                        'warning'
                    )
                }
            }
        });
    }

    function checkCampaign() {
        var campaign = document.getElementById("campaign").value;
        $.http({
            method: 'POST',
            url: inboxBaseUrl + '/cms/fetch/campaign',
            data: { campaign: campaign }
        }).done(function(response) {
            console.log(response);
            if (document.getElementById("campaign").value !== null) {
                if (response !== null) {
                    document.getElementById("campaign").value = "";
                    toastr.error("Campaign name already Exists. Choose a new name");
                }
            }
            console.log(response);
        });
    }


    function fetchMemberId() {

        var memberEmail = document.getElementById("memberEmail").value;
        $http({
            method: 'POST',
            url: inboxBaseUrl + '/cms/fetch/email',
            data: { memberEmail: memberEmail }
        }).done(function(response) {
            console.log(response);
            if (response.error == "No data exist") {
                document.getElementById("memberEmail").value = "";
                document.getElementById("memberId").value = "";
                toastr.error("No matching Email Id found.");
            } else {
                document.getElementById("memberId").value = response.memberId;
            }
        });
    }


}]);
