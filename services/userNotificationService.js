var UserNotificationService = app.service('UserNotificationService', ['$q', '$http', 'CONFIG', '$filter', function($q, $http, CONFIG, $filter) {
    this.baseUrl = CONFIG.INBOX.baseUrl;

    this.getAllRegionCodes = function() {
        var defer = $q.defer();
        $http({
            method: 'GET',
            // url: "https://testde.bms.bz/dataengine/mobile/app/index.bms?cmd=DEREGIONLIST&f=json&et=MT&t=67x1xa33b4x422b361ba&ch=mobile"
            url: this.baseUrl + "/inbox/regionCodes"
        }).then(function successCallback(response) {
            var regionCodes = response;
            defer.resolve(regionCodes);
        });
        return defer.promise;
    }
    this.getAllEmails = function() {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: this.baseUrl + "/inbox/emails"
        }).then(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    }

    this.getAllAnnouncements = function() {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: this.baseUrl + "/inbox/announcements"
        }).then(function successCallback(response) {
            var announcements = response;
            defer.resolve(announcements);
        });
        return defer.promise;
    }

    this.getAnnouncement = function(param) {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: this.baseUrl + "/inbox/announcement/" + param
        }).then(function successCallback(response) {
            var announcement = response;
            defer.resolve(announcement);
        });
        return defer.promise;
    }

    this.updateAnnouncement = function(announcement) {
        $http({
            method: 'POST',
            url: this.baseUrl + "/is/cms-push",
            data: announcement
        }).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(response) {
            console.log(response);
        });
    }

    this.getAllNotifications = function() {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: this.baseUrl + "/inbox/notifications"
        }).then(function successCallback(response) {
            var notifications = response;
            defer.resolve(notifications);
        });
        return defer.promise;
    }

    this.getNotification = function(param) {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: this.baseUrl + "/inbox/notification/" + param
        }).then(function successCallback(response) {
            var notification = response;
            defer.resolve(notification);
        });
        return defer.promise;
    }

    this.updateNotification = function(notification) {
        $http({
            method: 'POST',
            url: this.baseUrl + "/is/cms-push",
            data: notification
        }).then(function successCallback(response) {
            console.log(response);
        }, function errorCallback(response) {
            console.log(response);
        });
    }

    this.createMessage = function(message) {
        var defer = $q.defer();
        var messageResponse = '';
        $http({
            method: 'POST',
            url: this.baseUrl + "/is/cms-push",
            data: message
        }).then(function successCallback(response) {
            messageResponse = response;
            defer.resolve(messageResponse);
            console.log(response);
        }, function errorCallback(response) {
            messageResponse = response;
            defer.resolve(messageResponse);
            console.log(response);
        });
        return defer.promise;
    }

    this.checkUniqueAnnouncementCampaign = function(value) {
        var defer = $q.defer();
        $http({
            method: 'POST',
            url: this.baseUrl + '/cms/fetch/campaign_A',
            data: {
                campaign: value
            }
        }).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    }

    this.checkUniqueNotificationCampaign = function(value) {
        var defer = $q.defer();
        $http({
            method: 'POST',
            url: this.baseUrl + '/cms/fetch/campaign',
            data: {
                campaign: value
            }
        }).success(function(response) {
            defer.resolve(response);
        });
        return defer.promise;
    }

    this.fetchMemberIdFromEmailId = function(value) {
        var defer = $q.defer();
        $http({
            method: 'POST',
            url: this.baseUrl + '/cms/fetch/email',
            data: {
                memberEmail: value
            }
        }).success(function(response) {
            defer.resolve(response);
        });

        return defer.promise;
    }

    this.fetchMemberIdFromEmail = function(memberEmail) {
        var defer = $q.defer();
        $http({
            method: 'POST',
            url: this.baseUrl + '/cms/fetch/email',
            data: {
                memberEmail: memberEmail
            }
        }).then(function successCallback(response) {
            var memberId = response;
            defer.resolve(memberId);
        }, function errorCallback(response) {
            defer.reject();
        });
        return defer.promise;
    }

    this.getAllCampaigns = function(state) {
        var defer = $q.defer();
        $http({
            method: 'POST',
            data: { status: state },
            url: this.baseUrl + "/inbox/messages"
        }).then(function successCallback(response) {
            var campaigns = response;
            defer.resolve(campaigns);
        });
        return defer.promise;
    }
}]);
