'use strict';
angular.module('myApp.editNotification', ['ngRoute', 'ui.dateTimeInput']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/notification/:id', {
        templateUrl: 'views/editNotification.html',
    });
}]).controller('NotificationCtrl', ['$scope', '$location', '$routeParams', 'MessageService', 'AuthenticationService', function($scope, $location, $routeParams, MessageService, AuthenticationService) {

    if (!AuthenticationService.getToken()) {
        $location.path('/login');
        return;
    }

    var param = $routeParams.id;

    if (param) {
        MessageService.getNotification(param).then(function(notification) {
            var val = [];
            $scope.notification = notification.data[0];
            $scope.selected = val;
            $scope.parseKeyValuePairJson($scope.notification.customKeyValuePair);
            $scope.dateRangeStart = $scope.notification.validFrom;
            $scope.dateRangeEnd = $scope.notification.validTill;
            for (var i = 0; i < $scope.notification.appCodes.length; i++) {
                val[i] = $scope.notification.appCodes[i].appCode;
            }
            show();
        });
    }

    $scope.selectType = {
        "systemTypeValue": "CMS Announcement",
        "systemTypeValues": ['CMS Announcement', 'CMS Notification']
    };

    $scope.notificationData = {};
    $scope.appCodes = [];
    $scope.callToAction = [];
    $scope.appCodefield = {};
    $scope.appCodefieldsAll = {};

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
        MessageService.fetchMemberIdFromEmail(memberEmail).then(function(res) {
            if (res.data._id) {
                $scope.notification.memberId = res.data.memberId;
            } else {
                $scope.notification.memberId = null;
            }
        }).catch(function(err) {
            console.log(err);
        })
    }
    var appCodeTypeValues = ["WEBIN", 'MOBAND2', 'WEB', 'WEBTOUCH', 'MOBIOS3', 'MOBWIN10'];
    //for new appcode checkboxex
    $scope.items = appCodeTypeValues;
    $scope.selected = [];

    // key-value functionality start
    $scope.keyValuePairs = [];
    $scope.parsedKeyValuePair = {};
    var data = {};

    $scope.parseKeyValuePair = function(key, value) {
        $scope.keyValuePairs.forEach(function(value, index) {
            key = value.name;
            if (key && value.value) {
                $scope.parsedKeyValuePair[key] = value.value;
            }
        });
    };

    $scope.pushToParseKeyValuePair = function() {
        $scope.parseKeyValuePair();
    }

    $scope.addNewKeyValuePair = function() {
        $scope.keyValuePairs.push({
            name: '',
            value: ''
        });
    }

    $scope.removeKeyValuePair = function(index, key) {
        $scope.keyValuePairs.splice(index, 1);
        delete $scope.parsedKeyValuePair[key];
    }


    $scope.parseKeyValuePairJson = function(data) {
        var res = JSON.stringify(data);
        angular.forEach(angular.fromJson(res), function(value, key) {
            $scope.keyValuePair = {};
            $scope.keyValuePair.name = key;
            $scope.keyValuePair.value = value;
            $scope.keyValuePairs.push($scope.keyValuePair);

        });
    }


    // key-value functionality end

    function show() {
        if ($scope.selected.length == 0) {
            $scope.showDiv = false;
            console.log("hidden");

        } else {
            for (var i = 0; i < $scope.selected.length; i++) {
                if ($scope.selected[i] == "MOBAND2") {
                    $scope.showDiv = true;
                    break;
                } else {
                    $scope.showDiv = false;

                }
            }
        }
    }
    $scope.toggle = function(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        } else {
            list.push(item);
        }
        show();
    };

    $scope.exists = function(item, list) {
        return list.indexOf(item) > -1;
    };

    $scope.isIndeterminate = function() {
        return ($scope.selected.length !== 0 &&
            $scope.selected.length !== $scope.items.length);
    };

    $scope.isChecked = function() {
        return $scope.selected.length === $scope.items.length;
    };

    $scope.toggleAll = function() {
        if ($scope.selected.length === $scope.items.length) {
            $scope.selected = [];
        } else if ($scope.selected.length === 0 || $scope.selected.length > 0) {
            $scope.selected = $scope.items.slice(0);
        }
        show();
    };

    $scope.update = function(notification) {
        $scope.pushToParseKeyValuePair();
        if (notification.cardType == 'PlainText with CTA' || notification.cardType == 'PT_CTA') {
            $scope.notificationData.cardType = 'PT_CTA';
            $scope.appCodefield.text = notification.appCodes[0].callToAction[0].text;
            $scope.appCodefield.link = notification.appCodes[0].callToAction[0].link;
            $scope.appCodefield.target = notification.appCodes[0].callToAction[0].target;
        } else if (notification.cardType == 'PlainText' || notification.cardType == 'PT') {
            $scope.notificationData.cardType = 'PT';
        }

        if (notification.appCodes[0].callToAction[0].target == 'Same Window') {
            $scope.appCodefield.target = '_self';
        } else if (notification.appCodes[0].callToAction[0].target == 'New Window') {
            $scope.appCodefield.target = '_blank';
        }

        if ($scope.notification.memberId == null || $scope.dateRangeStart == null || $scope.dateRangeEnd == null || $scope.notification.shortTxt == null || $scope.notification.longTxt == null) {
            swal("Oops!", "Fill all mandatory fields please", "error");
            return false;
        }

        var appCodesAllFields = [];
        $scope.appCodes = [];

        for (var i = 0; i < $scope.selected.length; i++) {
            $scope.callToAction[0] = $scope.appCodefield;
            $scope.appCodes.push({
                appCode: $scope.selected[i],
                callToAction: $scope.callToAction
            })
        }
        $scope.notificationData.customKeyValuePair = $scope.parsedKeyValuePair;
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
        $scope.notificationData.flag = 'N';
        $scope.notificationData.from = "dashboard";
        $scope.notificationData.appCodes = $scope.appCodes;
        swal({
            title: "Are you sure?",
            text: "Please confirm do you want to update this campaign!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, update it!",
            closeOnConfirm: false
        }, function() {
            MessageService.updateNotification($scope.notificationData);
        });
    }
}]);
