angular.module('plunker', ['ui.bootstrap']);
var TabsDemoCtrl = function ($scope) {
  $scope.tabIndex = 0;
  $scope.buttonLabel = "Next";

  $scope.tabs = [
    { title:"Step 1", content:" content 1", active: true },
    { title:"Step 2", content:" content 2" },
    { title:"Step 3", content:" content 3" },
    { title:"Step 4", content:" content 4" }
    
  ];

  $scope.proceed = function() {
     if($scope.tabIndex !== $scope.tabs.length -1 ){
      $scope.tabs[$scope.tabIndex].active = false;
      $scope.tabIndex++
      $scope.tabs[$scope.tabIndex].active = true;
     }
     
     if($scope.tabIndex === $scope.tabs.length -1){
        $scope.buttonLabel = "Finish";
     }
     
  };


$scope.setIndex = function($index){
  $scope.tabIndex = $index;
}


  
};