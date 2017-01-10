'use strict';
angular.module('myApp.filters', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/filters', {
        templateUrl: 'views/filters.html',
    });
}]).controller('FilterCtrl', ['$scope', '$location', 'UserNotificationService', function($scope, $location, UserNotificationService) {

   
    $scope.filterMessage = function(filter){
    	 var message = UserNotificationService.filterMessage(filter).then(function(response) {
        $scope.data=response.data;
       console.log(response.data);
     
    });
    }
    
}]);
