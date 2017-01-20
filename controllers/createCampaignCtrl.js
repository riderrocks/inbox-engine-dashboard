'use strict';
angular.module('myApp.createCampaign', ['ngRoute', 'kendo.directives', 'ui.bootstrap', 'ngMaterial', 'ngMessages', 'material.svgAssetsCache']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/createCampaign', {
        templateUrl: 'views/createCampaign.html',
    });
}]).controller('NewCtrl', ['$scope', '$window', '$location', 'MessageService', 'AuthenticationService', '$timeout', '$q', function($scope, $window, $location, MessageService, AuthenticationService, $timeout, $q) {

    if (!AuthenticationService.getToken()) {
        $location.path('/login');
        return;
    }

    MessageService.getAllRegionCodes().then(function(regionCode) {
        var TopCities = regionCode.BookMyShow.TopCities;
        var OtherCities = regionCode.BookMyShow.OtherCities;
        var rawCities = TopCities.concat(OtherCities);
        var cities = [];
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
    });
    $scope.message = {};
    $scope.message.sequence = 5;
    $scope.messageType = {
        name: 'announcement'
    };

    // key-value functionality start

    $scope.keyValuePairs = [];
    $scope.parsedKeyValuePair = {};
    var data = {};

    $scope.parseKeyValuePair = function(key, value) {
        $scope.keyValuePairs.forEach(function(value, index) {
            console.log(value);
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

    // key-value functionality end

    $scope.systemTypeValue = {
        name: 'CMS Announcement'
    };

    var appCodeTypeValues = ["WEBIN", 'MOBAND2', 'WEB', 'WEBTOUCH', 'MOBIOS3', 'MOBWIN10'];
    $scope.selectType = {
        "targetTypeValue": "New Window",
        "targetTypeValues": ['New Window', 'Same Window'],
        "messageCardTypeValue": "PlainText",
        "messageCardTypeValues": ["PlainText", "PlainText with CTA"]
    };

    $scope.messageType.announcement = true;
    $scope.messageType.notification = false;
    $scope.showKeyValue = true;

    $scope.fetchMemberId = function() {
        var memberEmail = $scope.searchText;
        MessageService.fetchMemberIdFromEmailId(memberEmail).then(function(response) {
            if (response.error == "No data exist") {
                swal('Oops...', 'No matching Email Id found.', 'warning');
            } else {
                $scope.message.memberId = response.memberId;
            }
        });
    }

    $scope.changeState = function(messageType) {
        $scope.showKeyValue = false;
        if (messageType.name == 'announcement') {
            $scope.messageType.announcement = true;
            $scope.messageType.notification = false;
            $scope.systemTypeValue.name = 'CMS Announcement';
            $scope.showKeyValue = true;
        } else if (messageType.name == 'notification') {
            $scope.messageType.notification = true;
            $scope.messageType.announcement = false;
            $scope.systemTypeValue.name = 'CMS Notification';
            $scope.showKeyValue = true;
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

    //for new appcode checkboxex

    $scope.create = function(message) {
        $scope.pushToParseKeyValuePair();
        console.log($scope.keyValuePairs);
        if ($scope.dateRangeStart == null) {
            swal('Oops...', 'Fill Valid From & Valid Till fields before submission!', 'warning');
            return false;
        }

        if ($scope.messageType.name == 'announcement') {
            message.flag = 'A';
            delete message.memberId;
            delete message.memberEmail;
            if ($scope.selected.length == 0 || $scope.selectedIds == null || $scope.message.campaign == null || $scope.message.shortTxt == null || $scope.message.longTxt == null) {
                swal("Heyy!", "Need To Fill Up The Mandatory Feilds", "error");
                return false;
            }
        } else if ($scope.messageType.name == 'notification') {
            message.flag = 'N';
            message.memberEmail = $scope.searchText;
            delete message.regionCode;
            if ($scope.selected.length == 0 || $scope.message.memberId == null || $scope.searchText == null || $scope.message.campaign == null || $scope.message.shortTxt == null || $scope.message.longTxt == null) {
                swal("Heyy!", "Need To Fill Up The Mandatory Feilds", "error");
                return false;
            }
        }

        if ($scope.selectType.messageCardTypeValue == 'PlainText') {
            message.cardType = 'PT';
            message.customKeyValuePair = $scope.parsedKeyValuePair;
            if ($scope.selected.length > 1) {
                $scope.appCodes = [];
                $scope.appCodefieldsAll = {};
                $scope.appCodefield = {};
                $scope.callToAction = [];
                for (var i = 0; i < $scope.selected.length; i++) {
                    $scope.appCodefield.target = "_self";
                    $scope.callToAction.push($scope.appCodefield);
                    $scope.appCodefieldsAll.callToAction = $scope.callToAction;
                    $scope.appCodefieldsAll.appCode = $scope.selected[i];
                    $scope.appCodes.push($scope.appCodefieldsAll);
                    $scope.callToAction = [];
                    $scope.appCodefieldsAll = {};
                }
            } else {
                $scope.appCodes = [];
                $scope.callToAction = [];
                $scope.appCodefieldsAll = {};
                $scope.appCodefield = {};
                $scope.appCodefield.target = "_self";
                $scope.callToAction.push($scope.appCodefield);
                $scope.appCodefieldsAll.callToAction = $scope.callToAction;
                $scope.appCodefieldsAll.appCode = $scope.selected;
                $scope.appCodes.push($scope.appCodefieldsAll);
            }


        } else if ($scope.selectType.messageCardTypeValue == 'PlainText with CTA') {
            message.cardType = 'PT_CTA';
            message.customKeyValuePair = $scope.parsedKeyValuePair;
            console.log($scope.appCodefield);
            if ($scope.appCodefield == null) {
                swal('Oops...', "Need To Fill Up The Mandatory Feilds", "error");
                return false;
            } else {
                if ($scope.appCodefield.text == null || $scope.appCodefield.link == null) {
                    swal('Oops...', "Need To Fill Up The Mandatory Feilds", "error");
                    return false;
                }
            }
            if ($scope.selectType.targetTypeValue == 'New Window') {
                $scope.appCodefield.target = '_blank';
            } else if ($scope.selectType.targetTypeValue == 'Same Window') {
                $scope.appCodefield.target = '_self';
            }
            if ($scope.selected.length > 1) {
                $scope.appCodes = [];
                $scope.appCodefieldsAll = {};
                $scope.callToAction = [];
                for (var i = 0; i < $scope.selected.length; i++) {
                    $scope.appCodefield.target = "_self";
                    $scope.callToAction.push($scope.appCodefield);
                    $scope.appCodefieldsAll.callToAction = $scope.callToAction;
                    $scope.appCodefieldsAll.appCode = $scope.selected[i];
                    $scope.appCodes.push($scope.appCodefieldsAll);
                    $scope.callToAction = [];
                    $scope.appCodefieldsAll = {};
                }
            } else {
                $scope.appCodes = [];
                $scope.appCodefieldsAll = {};
                $scope.callToAction = [];
                $scope.callToAction.push($scope.appCodefield);
                $scope.appCodefieldsAll.appCode = $scope.selected;
                $scope.appCodefieldsAll.callToAction = $scope.callToAction;
                $scope.appCodes.push($scope.appCodefieldsAll);
            }
        }

        message.from = 'cms';
        message.type = $scope.systemTypeValue.name;
        message.validFrom = $scope.dateRangeStart;
        message.validTill = $scope.dateRangeEnd;
        message.appCodes = $scope.appCodes;
        console.log(message);
        MessageService.createMessage(message).then(function(res) {
            $scope.res = res;
            if ($scope.res.status == 200) {
                $scope.appCodefield = {};
                swal({
                    title: "Done!",
                    text: "Message sent to queue successfully",
                    type: "success"
                }, function() {
                    $location.path('/viewCampaigns');
                });
            }
        });
        $scope.message = {};
        $scope.searchText = null;
        $scope.dateRangeStart = null;
        $scope.dateRangeEnd = null;
        $scope.selectedIds = null;
    }

    $scope.limmiter = function() {
        $scope.sequence = $scope.message.sequence;
        if ($scope.sequence == undefined) {
            $scope.message.sequence = null;
            swal('Oops...', 'NOTE: 5 is largest permissible value!', 'warning');
        }
        if ($scope.sequence == 0) {
            $scope.message.sequence = null;
            swal('Oops...', 'NOTE: Your selection should be greater than zero', 'warning');
        }
    }

    $scope.dateChecker_validfrom = function() {
        $scope.validFrom = new Date($scope.dateRangeStart);
        $scope.date = new Date();
        if ($scope.validFrom < $scope.date) {
            $scope.dateRangeStart = null;
            swal('Oops...', 'Valid From cannot be less than Present Date!', 'warning');
        }
    }

    $scope.dateChecker_validtill = function() {
        $scope.validFrom = JSON.stringify(new Date($scope.dateRangeStart));
        $scope.date = new Date($scope.dateRangeStart);

        if ($scope.validFrom == 'null') {
            $scope.dateRangeEnd = null;
            swal('Oops...', 'Fill Valid From Field First !', 'warning');
        }

        $scope.date = new Date($scope.dateRangeStart);
        $scope.validDate = new Date($scope.date.setMinutes($scope.date.getMinutes() + 350));
        $scope.validTill = new Date($scope.dateRangeEnd);

        if ($scope.validTill < $scope.validDate) {
            $scope.dateRangeEnd = null;
            swal('Oops...', 'Valid Till cannot be less than ' + $scope.validDate, 'warning');
        }
    }

    $scope.checkCampaign = function() {
        var value = $scope.message.campaign;
        if ($scope.messageType.name === "announcement") {
            MessageService.checkUniqueAnnouncementCampaign(value).then(function(response) {
                if ($scope.message.campaign !== null) {
                    if (response !== null) {
                        $scope.message.campaign = null;
                        swal('Oops...', 'Campaign name already Exists. Choose a new name!', 'warning');
                    }
                }
            });
        } else if ($scope.messageType.name == 'notification') {
            MessageService.checkUniqueNotificationCampaign(value).then(function(response) {
                if ($scope.message.campaign !== null) {
                    if (response !== null) {
                        $scope.message.campaign = null;
                        swal('Oops...', 'Campaign name already Exists. Choose a new name!', 'warning');
                    }
                }
            });
        }
    }

    $scope.showWarning = function() {
        $scope.show = true;
    }

    // searchable email


    loadAll().then(function(emails) {
        $scope.email = emails;
    })
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.querySearch = querySearch;
    $scope.emailList = [];

    function querySearch(query) {
        var results = query ? $scope.email.filter(createFilterFor(query)) : $scope.email;
        var deferred = $q.defer();
        $timeout(function() {
            deferred.resolve(results);
        }, Math.random() * 1000, false);
        return deferred.promise;
    }

    function loadAll() {
        return MessageService.getAllEmails().then(function(emails) {
            for (var i = 0; i < emails.data.length; i++) {
                $scope.emailList.push(emails.data[i].memberEmail);
            }

            function removeDuplicates(value) {
                var x,
                    len = value.length,
                    out = [],
                    obj = {};

                for (x = 0; x < len; x++) {
                    obj[value[x]] = 0;
                }
                for (x in obj) {
                    out.push(x);
                }
                return out;
            }
            $scope.emailList = removeDuplicates($scope.emailList);
            $scope.emailList = $scope.emailList.toString();
            return $scope.emailList.split(/,+/g).map(function(state) {
                return {
                    value: state.toLowerCase(),
                    display: state
                };
            });
        });
    }

    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        };

    }
}]);
