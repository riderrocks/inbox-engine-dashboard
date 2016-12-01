var UserNotificationService = app.service('UserNotificationService', ['$q', '$http', 'CONFIG', '$filter', function($q, $http, CONFIG, $filter) {
    this.baseUrl = CONFIG.INBOX.baseUrl;

    this.getAllNotifications = function() {
        currentObject = this;
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: this.baseUrl + "inbox/notifications"
        }).then(function successCallback(response) {
            var notifications = response;
            defer.resolve(notifications);
        });
        return defer.promise;
    }

    this.getAllAnnouncements = function() {
        currentObject = this;
        var defer = $q.defer();
        $http({
            method: 'GET',
            url: this.baseUrl + "inbox/announcements"
        }).then(function successCallback(response) {
            var announcements = response;
            defer.resolve(announcements);
        });
        return defer.promise;
    }
}]);
