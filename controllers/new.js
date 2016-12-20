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

    $scope.selectType = {
        "systemTypeValue": "BACKOFFICE",
        "systemTypeValues": ["BACKOFFICE"],
        "appCodeTypeValue": "WEBIN",
        "appCodeTypeValues": ["WEBIN"],
        "targetTypeValue": "New Window",
        "targetTypeValues": ["New Window", "Same Window"]
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
        $scope.dateChecker_validfrom();
    });

    function endDateOnSetTime() {
        $scope.$broadcast('end-date-changed');
    }
    $scope.$on('end-date-changed', function(event, args) {

        $scope.dateChecker_validtill();
    });

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
        $scope.appCode = $scope.selectType.appCodeTypeValue;
        $scope.appCodefield.target = $scope.selectType.targetTypeValue;
        $scope.appCodes = [];
        $scope.callToAction = [];
        $scope.appCodefieldsAll = {};
        $scope.callToAction.push($scope.appCodefield);
        $scope.appCodefieldsAll.appCode = $scope.appCode;
        $scope.appCodefieldsAll.callToAction = $scope.callToAction;
        $scope.appCodes.push($scope.appCodefieldsAll);
        message.from = 'cms';
        message.validFrom = $scope.dateRangeStart;
        message.validTill = $scope.dateRangeEnd;
        message.appCodes = $scope.appCodes;
        message.type = $scope.selectType.systemTypeValue;

        $scope.validFrom = new Date($scope.dateRangeStart);
        $scope.date = new Date();

        if ($scope.validFrom < $scope.date) {
            $scope.dateRangeStart = null;
            swal(
                'Oops...',
                'Valid From cannot be less than Present Date!',
                'warning'
            )
            return false;
        }

        if ($scope.messageType.name == 'announcement') {
            message.flag = 'A';
            delete message.memberId;
            delete message.memberEmail;
            console.log(message);
            if ($scope.selectedIds == null) {
                swal("Heyy!", "Need to specify the RegionCode", "error");
                return false;
            }
        } else if ($scope.messageType.name == 'notification') {
            message.flag = 'N';
            delete message.regionCode;
            console.log(message);
        }

        UserNotificationService.createMessage(message).then(function(res) {
            $scope.res = res;
            if ($scope.res.status == 200) {
                $scope.appCodefield = {};
            }
        });
        $scope.message = {};
        $scope.dateRangeStart = null;
        $scope.dateRangeEnd = null;
        $scope.selectedIds = null;
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
                'warning'
            )

        }
        if ($scope.sequence == 0) {
            $scope.message.Sequence = null;
            swal(
                'Oops...',
                'NOTE: Your selection should be grater than zero',
                'warning'
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

    $scope.dateChecker_validfrom = function() {
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
    $scope.dateChecker_validtill = function() {
        $scope.validFrom = JSON.stringify(new Date($scope.dateRangeStart));
        $scope.date = new Date($scope.dateRangeStart);
        if ($scope.validFrom == 'null') {
            $scope.dateRangeEnd = null;
            swal(
                'Oops...',
                'Fill Valid From Field First !',
                'warning'
            )

        }
        $scope.date = new Date($scope.dateRangeStart);
        $scope.validDate = new Date($scope.date.setMinutes($scope.date.getMinutes() + 350));
        $scope.validTill = new Date($scope.dateRangeEnd);
        console.log(new Date($scope.validDate));
        console.log(new Date($scope.validTill));
        if ($scope.validTill < $scope.validDate) {
            $scope.dateRangeEnd = null;
            swal(
                'Oops...',
                'The minimum difference between Valid From & Valid Till must be 5hrs and 50 minutes',
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
    $scope.show = false;
    $scope.showWarning = function() {
        $scope.show = true;
    }
    $scope.fetchMemberId = function() {
        var memberEmail = $scope.message.memberEmail;
        UserNotificationService.fetchMemberIdFromEmailId(memberEmail).then(function(response) {
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
