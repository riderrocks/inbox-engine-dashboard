var UserNotificationService = app.service('UserNotificationService', ['$q', '$http', '$window', 'CONFIG', '$filter', function($q, $http, $window, CONFIG, $filter) {
    this.baseUrl = CONFIG.INBOX.baseUrl;

    this.getAllRegionCodes = function() {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: this.baseUrl + "/inbox/regionCodes"
        }).then(function successCallback(response) {
            var regionCodes = JSON.parse(response.data.body);
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
            if (response.status == 200 && response.data.msg == 'Success') {
                swal("Done!", "Message updated successfully", "success");
            }
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
            if (response.status == 200 && response.data.msg == 'Success') {
                swal("Done!", "Message updated successfully", "success");
            }
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
            data: {
                status: state
            },
            url: this.baseUrl + "/inbox/messages"
        }).then(function successCallback(response) {
            var campaigns = response;
            defer.resolve(campaigns);
        });
        return defer.promise;
    }

    this.stopCampaign = function(campaign) {
        $http({
            method: 'PUT',
            url: this.baseUrl + "/inbox/stopCampaign",
            data: campaign
        }).then(function successCallback(response) {
            if (response.status == 200 && response.data.success == 'success') {
                swal({
                    title: "Done!",
                    text: "Campaign stopped successfully",
                    type: "success"
                }, function() {
                    $window.location.reload();
                });
            }
        }, function errorCallback(response) {
            console.log(response);
        });
    }

    this.getRoles = function() {
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: this.baseUrl + "/roles"
        }).then(function successCallback(response) {
            var roles = response;
            defer.resolve(roles);
        });
        return defer.promise;
    }

    this.createUser = function(user) {
        var defer = $q.defer();
        $http({
            method: 'POST',
            url: this.baseUrl + "/users",
            data: user
        }).then(function successCallback(response) {
            defer.resolve(response);
        }, function errorCallback(response) {
            console.log(response);
        });
        return defer.promise;
    }
}]);
