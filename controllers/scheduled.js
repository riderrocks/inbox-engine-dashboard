'use strict';
angular.module('myApp.scheduled', ['ngRoute']).config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/scheduled', {
        templateUrl: 'views/scheduled.html',
        controller: 'ScheduledCtrl'
    });
}]).controller('ScheduledCtrl', ['$scope', '$location', function($scope, $location) {
    // if (!CommonProp.getUser()) {
    //     $location.path('/home');
    // }
    // var login = {};
    // $scope.login = login;

    // var ref = new Firebase("https://radiant-torch-5333.firebaseio.com/Images");  
    // var fb = $firebase(ref);

    // var syncObject = fb.$asObject();

    // // three way data binding
    // syncObject.$bindTo($scope, 'images');
    // // console.log(syncObject);

    // $scope.AddImages = function(files) {
    //     login.loading = true;
    //     var fb = new Firebase("https://radiant-torch-5333.firebaseio.com/Images");
    //     var fbAuth = fb.getAuth();
    //     var newFb = fb.child(fbAuth.uid);
    //     Upload.base64DataUrl(files).then(function(base64Urls) {
    //         newFb.push({
    //             images: base64Urls
    //         }, function(error) {
    //             if (error) {
    //                 console.log("Error:", error);
    //             } else {
    //                 login.loading = false;
    //                 swal("Yay!", "Image uploaded successfully", "success");
    //                 $location.path('/welcome');
    //                 $scope.$apply();
    //             }
    //         });
    //     });
    // }
    // $scope.remove = function(array, index) {
    // var ref = new Firebase("https://radiant-torch-5333.firebaseio.com/Images");

    // ref.on("value", function(snapshot) {
    //     var sync = $firebase(ref.startAt($scope.username).endAt($scope.username));
    //     var images = sync.$asArray();
    //     console.log(images);
    // }, function(errorObject) {
    //     console.log("The read failed: " + errorObject.code);
    // });
    //     array.splice(index, 1);
    // }
    // $scope.logout = function() {
    //         CommonProp.logoutUser();
    //     }
}]);
