// 'use strict';
angular.module('myApp.new', ['ngRoute', 'kendo.directives', 'ui.bootstrap', 'ngMaterial']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/new', {
        templateUrl: 'views/new.html',
    });
}]).controller('NewCtrl', ['$scope', '$window', '$location', 'UserNotificationService', '$timeout', '$q', function($scope, $window, $location, UserNotificationService, $timeout, $q) {
    UserNotificationService.getAllRegionCodes().then(function(regionCode) {
        // var TopCities = regionCode.data.BookMyShow.TopCities;
        // var OtherCities = regionCode.data.BookMyShow.OtherCities;
        // var cities = TopCities.concat(OtherCities);
        // var city = {};
        // city.name = [];
        // city.code = [];
        // for (i = 0; i < cities.length; i++) {
        //     city.name[i] = cities[i].RegionName;
        //     city.code[i] = cities[i].RegionCode;

        // }
        // console.log(city);
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
        "targetTypeValues": ["New Window", "Same Window"],
        "messageCardTypeValue": "PlainText",
        "messageCardTypeValues": ["PlainText", "PlainText with CTA"]
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

    //to hide and show CTA
    document.getElementById("text").style.display = "none";
    document.getElementById("link").style.display = "none";
    document.getElementById("target").style.display = 'none';


    $scope.messageCardType = function(messageCardType) {
        if (messageCardType == 'PlainText') {
            document.getElementById("text").style.display = "none";
            document.getElementById("link").style.display = "none";
            document.getElementById("target").style.display = 'none';

        } else if (messageCardType == "PlainText with CTA") {
            document.getElementById("text").style.display = '';
            document.getElementById("link").style.display = '';
            document.getElementById("target").style.display = '';

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
        console.log($scope.selectType.messageCardTypeValue);
        if ($scope.selectType.messageCardTypeValue == 'PlainText') {
            message.cardType = 'PT';
            $scope.appCodes = [];
            $scope.callToAction = [];
            $scope.appCodefieldsAll = {};
            $scope.appCodefield = {};
            $scope.appCodefield.target = "_self";
            console.log($scope.appCodefield.target);
            $scope.callToAction.push($scope.appCodefield);
            $scope.appCodefieldsAll.callToAction = $scope.callToAction;
            $scope.appCodefieldsAll.appCode = $scope.selectType.appCodeTypeValue;

            $scope.appCodes.push($scope.appCodefieldsAll);


        } else if ($scope.selectType.messageCardTypeValue == 'PlainText with CTA') {
            message.cardType = 'CTA';
            $scope.appCodes = [];
            $scope.appCodefieldsAll = {};
            $scope.appCodefield.target = $scope.selectType.targetTypeValue;
            $scope.callToAction = [];
            $scope.callToAction.push($scope.appCodefield);
            $scope.appCodefieldsAll.appCode = $scope.selectType.appCodeTypeValue;
            $scope.appCodefieldsAll.callToAction = $scope.callToAction;
            $scope.appCodes.push($scope.appCodefieldsAll);
        }

        message.from = 'cms';
        message.type = $scope.selectType.systemTypeValue;
        message.validFrom = $scope.dateRangeStart;
        message.validTill = $scope.dateRangeEnd;
        message.appCodes = $scope.appCodes;

        $scope.validFrom = new Date($scope.dateRangeStart);
        if ($scope.validFrom == null) {
            swal(
                'Oops...',
                'Fill validFrom and ValidTill fields before submission!',
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
            message.memberId = document.getElementById('value1').innerHTML;
            message.memberEmail = $scope.searchText;
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
        document.getElementById('value1').innerHTML = '';
        $scope.searchText = null;
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
                'NOTE: 5 is largest permissible value!',
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
                'Valid Till cannot be less than ' + $scope.validDate,
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
        var memberEmail = $scope.searchText;
        UserNotificationService.fetchMemberIdFromEmailId(memberEmail).then(function(response) {
            if (response.error == "No data exist") {

                swal('Oops...', 'No matching Email Id found.', 'warning');
            } else {
                document.getElementById('value1').innerHTML = response.memberId;
                console.log(document.getElementById('value1').innerHTML);
            }
        });

    }

    // searchable email



    // list of `state` value/display objects
    loadAll().then(function(emails) {
        $scope.email = emails;
    })
    $scope.selectedItem = null;
    $scope.searchText = null;
    $scope.querySearch = querySearch;
    $scope.emailList = [];

    // ******************************
    // Internal methods
    // ******************************

    /**
     * Search for Emails
... use $timeout to simulate
     * remote dataservice call.
     */
    function querySearch(query) {
        var results = query ? $scope.email.filter(createFilterFor(query)) : $scope.email;
        var deferred = $q.defer();
        $timeout(function() { deferred.resolve(results); }, Math.random() * 1000, false);
        return deferred.promise;
    }

    /**
     * Build `email` list of key/value pairs
     */
    function loadAll() {
        return UserNotificationService.getAllEmails().then(function(emails) {
            for (var i = 0; i < emails.data.length; i++) {
                $scope.emailList.push(emails.data[i].memberEmail);
            }
            console.log($scope.emailList);

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
            // localStorage.setItem('allEmails', $scope.emailList);
            // //  = JSON.stringify(emails);
            // var allEmails = localStorage.getItem("allEmails");
            return $scope.emailList.split(/,+/g).map(function(state) {
                return {
                    value: state.toLowerCase(),
                    display: state
                };
            });
        });
    }

    /**
     * Create filter function for a query string
     */
    function createFilterFor(query) {
        var lowercaseQuery = angular.lowercase(query);

        return function filterFn(state) {
            return (state.value.indexOf(lowercaseQuery) === 0);
        };

    }
    $scope.test = function() {
        console.log($scope.searchText);
    }
}]);
