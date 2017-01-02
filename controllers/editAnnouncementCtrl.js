'use strict';
angular.module('myApp.editAnnouncement', ['ngRoute', 'kendo.directives', 'ui.dateTimeInput']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/announcement/:id', {
        templateUrl: 'views/editAnnouncement.html',
    });
}]).controller('AnnouncementCtrl', ['$scope', '$location', '$routeParams', 'UserNotificationService', function($scope, $location, $routeParams, UserNotificationService) {

    var param = $routeParams.id;

    UserNotificationService.getAllRegionCodes().then(function(regionCode) {
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

        function getObjects(obj, key, val) {

            var objects = [];
            for (var i in obj) {
                if (!obj.hasOwnProperty(i)) continue;
                if (typeof obj[i] == 'object') {
                    objects = objects.concat(getObjects(obj[i], key, val));
                } else if (i == key && obj[key] == val) {
                    objects.push(obj);
                }
            }
            return objects;
        }
        UserNotificationService.getAnnouncement(param).then(function(announcement) {
            $scope.announcement = announcement.data[0];
            for (var i = 0; i < $scope.announcement.regionCode.length; i++) {
                var val = $scope.announcement.regionCode[i]
                getObjects(cities, 'code_city', val);
            }
            $scope.selectedIds = $scope.announcement.regionCode;
            $scope.dateRangeStart = $scope.announcement.validFrom;
            $scope.dateRangeEnd = $scope.announcement.validTill;
        });
    });

    $scope.selectType = {
        "systemTypeValue": "CMS announcement",
        "systemTypeValues": ['CMS announcement', 'CMS Notification'],
        "appCodeTypeValue": "WEBIN",
        "appCodeTypeValues": ['WEBIN', 'MOBAND2', 'WEB', 'WEBTOUCH', 'MOBIOS3', 'MOBWIN10']
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
        $scope.announcementData = {};
        $scope.appCodes = [];
        $scope.callToAction = [];
        $scope.appCodefield = {};
        $scope.appCodefieldsAll = {};

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
            swal("Ah ah!", "Fill all mandatory fields please", "error");
            return false;
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
        $scope.callToAction.push($scope.appCodefield);
        $scope.appCodefieldsAll.appCode = announcement.appCodes[0].appCode;
        $scope.appCodefieldsAll.callToAction = $scope.callToAction;
        $scope.appCodes.push($scope.appCodefieldsAll);
        $scope.announcementData.from = "dashboard";
        $scope.announcementData.flag = 'A';
        $scope.announcementData.appCodes = $scope.appCodes;
        UserNotificationService.updateAnnouncement($scope.announcementData);
    }
}]);
