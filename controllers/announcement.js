'use strict';
angular.module('myApp.announcement', ['ngRoute', 'kendo.directives', 'ui.dateTimeInput']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/announcement/:id', {
        templateUrl: 'views/announcement.html',
    });
}]).controller('AnnouncementCtrl', ['$scope', '$location', '$routeParams', 'UserNotificationService', function($scope, $location, $routeParams, UserNotificationService) {

    var param = $routeParams.id;

    UserNotificationService.getAllRegionCodes().then(function(regionCode) {
        var TopCities = regionCode.BookMyShow.TopCities;
        var OtherCities = regionCode.BookMyShow.OtherCities;
        var rawCities = TopCities.concat(OtherCities);
        var cities = [];
        for (i = 0; i < rawCities.length; i++) {
            cities.push({ name_city: rawCities[i].RegionName, code_city: rawCities[i].RegionCode });
        }
        $scope.selectOptions = {
            placeholder: "Select RegionCode...",
            dataTextField: 'name_city',
            dataValueField: 'code_city',
            dataSource: cities

        };
    });
    UserNotificationService.getAnnouncement(param).then(function(announcement) {
        $scope.announcement = announcement;
        $scope.selectedIds = $scope.announcement.data[0].regionCode;
        $scope.dateRangeStart = $scope.announcement.data[0].validFrom;
        $scope.dateRangeEnd = $scope.announcement.data[0].validTill;
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

    $scope.update = function(announcement) {
        $scope.announcementData = {};
        $scope.appCodes = [];
        $scope.callToAction = [];
        $scope.appCodefield = {};
        $scope.appCodefieldsAll = {};
        $scope.announcementData._id = announcement.data[0]._id;
        $scope.announcementData.campaign = announcement.data[0].campaign;
        $scope.announcementData.shortTxt = announcement.data[0].shortTxt;
        $scope.announcementData.imgURL = announcement.data[0].imgURL;
        $scope.announcementData.longTxt = announcement.data[0].longTxt;
        $scope.announcementData.sequence = announcement.data[0].sequence;
        $scope.announcementData.type = announcement.data[0].type;
        $scope.announcementData.validFrom = $scope.dateRangeStart;
        $scope.announcementData.validTill = $scope.dateRangeEnd;
        $scope.announcementData.regionCode = announcement.data[0].regionCode;
        $scope.appCodefield.text = announcement.data[0].appCodes[0].callToAction[0].text;
        $scope.appCodefield.link = announcement.data[0].appCodes[0].callToAction[0].link;
        $scope.appCodefield.target = announcement.data[0].appCodes[0].callToAction[0].target;
        $scope.callToAction.push($scope.appCodefield);
        $scope.appCodefieldsAll.appCode = announcement.data[0].appCodes[0].appCode;
        $scope.appCodefieldsAll.callToAction = $scope.callToAction;
        $scope.appCodes.push($scope.appCodefieldsAll);
        $scope.announcementData.from = "dashboard";
        $scope.announcementData.flag = 'A';
        $scope.announcementData.appCodes = $scope.appCodes;
        UserNotificationService.updateAnnouncement($scope.announcementData);
        swal("Done!", "Message updated successfully", "success");
    }
    $scope.show = true;
    $scope.showWarning = function() {
        $scope.show = true;
    }
    $scope.limmiter = function() {
        $scope.sequence = $scope.announcement.data[0].sequence;
        console.log($scope.sequence);
        if ($scope.sequence == undefined) {
            $scope.announcement.data[0].sequence = null;
            swal(
                'Oops...',
                'NOTE: 99 is largest permissible value!',
                'warning'
            )

        }
        if ($scope.sequence == 0) {
            $scope.announcement.data[0].sequence = null;
            swal(
                'Oops...',
                'NOTE: Your selection should be grater than zero',
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
}]);
