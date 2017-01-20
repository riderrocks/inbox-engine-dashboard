'use strict';
angular.module('myApp.editAnnouncement', ['ngRoute', 'kendo.directives', 'ui.dateTimeInput']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/announcement/:id', {
        templateUrl: 'views/editAnnouncement.html',
    });
}]).controller('AnnouncementCtrl', ['$scope', '$location', '$routeParams', 'MessageService', 'AuthenticationService', function($scope, $location, $routeParams, MessageService, AuthenticationService) {

    if (!AuthenticationService.getToken()) {
        $location.path('/login');
        return;
    }
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
        // till here.

    var param = $routeParams.id;
    MessageService.getAllRegionCodes().then(function(regionCode) {
        var cities = [];
        var TopCities = regionCode.BookMyShow.TopCities;
        var OtherCities = regionCode.BookMyShow.OtherCities;
        var rawCities = TopCities.concat(OtherCities);
        for (var i = 0; i < rawCities.length; i++) {
            cities.push({
                name_city: rawCities[i].RegionName,
                code_city: rawCities[i].RegionCode
            });
        }
        $scope.selectOptions = {
            placeholder: "Select RegionCode...",
            dataTextField: 'name_city',
            dataValueField: 'code_city',
            dataSource: cities

        };
        var appCodeTypeValues = ["WEBIN", 'MOBAND2', 'WEB', 'WEBTOUCH', 'MOBIOS3', 'MOBWIN10'];
        //for new appcode checkboxex
        $scope.items = appCodeTypeValues;
        $scope.selected = [];

        function show() {
            if ($scope.selected.length == 0) {
                $scope.showDiv = false;
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
        MessageService.getAnnouncement(param).then(function(announcement) {
            var val = [];
            $scope.announcement = announcement.data[0];
            console.log($scope.announcement.customKeyValuePair);
            $scope.selected = val;
            $scope.selectedIds = $scope.announcement.regionCode;
            $scope.dateRangeStart = $scope.announcement.validFrom;
            $scope.dateRangeEnd = $scope.announcement.validTill;
            for (var i = 0; i < $scope.announcement.appCodes.length; i++) {
                val[i] = $scope.announcement.appCodes[i].appCode;
            }
            show();
        });
    });

    $scope.selectType = {
        "systemTypeValue": "CMS announcement",
        "systemTypeValues": ['CMS announcement', 'CMS Notification']
    };

    $scope.announcementData = {};
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
        $scope.sequence = $scope.announcement.sequence;
        if ($scope.sequence == undefined) {
            $scope.announcement.sequence = null;
            swal('Oops...', 'NOTE: 5 is largest permissible value!', 'warning');
        }
        if ($scope.sequence == 0) {
            $scope.announcement.sequence = null;
            swal('Oops...', 'NOTE: Your selection should be greater than zero', 'warning');
        }
    }

    $scope.update = function(announcement) {
        if (announcement.cardType == 'PlainText with CTA' || announcement.cardType == 'PT_CTA') {
            $scope.announcementData.cardType = 'PT_CTA';
            $scope.appCodefield.text = announcement.appCodes[0].callToAction[0].text;
            $scope.appCodefield.link = announcement.appCodes[0].callToAction[0].link;
            $scope.appCodefield.target = announcement.appCodes[0].callToAction[0].target;
        } else if (announcement.cardType == 'PlainText' || announcement.cardType == 'PT') {
            $scope.announcementData.cardType = 'PT';
        }

        if (announcement.appCodes[0].callToAction[0].target == 'Same Window') {
            $scope.appCodefield.target = '_self';
        } else if (announcement.appCodes[0].callToAction[0].target == 'New Window') {
            $scope.appCodefield.target = '_blank';
        }

        if ($scope.announcement.regionCode == null || $scope.dateRangeStart == null || $scope.dateRangeEnd == null || $scope.announcement.shortTxt == null || $scope.announcement.longTxt == null) {
            swal("Oops!", "Fill all mandatory fields please", "error");
            return false;
        }

        var appCodesAllFields = [];
        for (var i = 0; i < $scope.selected.length; i++) {
            $scope.callToAction[0] = $scope.appCodefield;
            $scope.appCodes.push({
                appCode: $scope.selected[i],
                callToAction: $scope.callToAction
            })
        }
        $scope.announcementData._id = announcement._id;
        $scope.announcementData.campaign = announcement.campaign;
        $scope.announcementData.shortTxt = announcement.shortTxt;
        $scope.announcementData.imgURL = announcement.imgURL;
        $scope.announcementData.longTxt = announcement.longTxt;
        $scope.announcementData.sequence = announcement.sequence;
        $scope.announcementData.type = announcement.type;
        $scope.announcementData.validFrom = $scope.dateRangeStart;
        $scope.announcementData.validTill = $scope.dateRangeEnd;
        $scope.announcementData.regionCode = announcement.regionCode;
        $scope.announcementData.from = "dashboard";
        $scope.announcementData.flag = 'A';
        $scope.announcementData.appCodes = $scope.appCodes;
        swal({
            title: "Are you sure?",
            text: "Please confirm do you want to update this campaign!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Yes, update it!",
            closeOnConfirm: false
        }, function() {
            MessageService.updateAnnouncement($scope.announcementData);
        });
    }
}]);
