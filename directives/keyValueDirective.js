// app.directive('mainArea', function() {
//     return {
//         restrict: "E",
//         template: "<div id='customMainDiv'> </div>" +
//             "<a data-ng-click='append()'>+ Add New Pair</a><button ng-click='remove()''>X</button>",
//         controller: function($scope, $element, $attrs) {
//             $scope.append = function() {
//                 var count = 0;
//                 count++;
//                 var p = angular.element(`<div id='count'><input type="text" placeholder="Key"><input type="text" placeholder="Value"></div>`);
//                 // p.text("Appended");
//                 $element.find("div#customMainDiv").append(p);
//             }

//             $scope.remove = function() {
//                 alert('yes');
//                 $element.find("div#one").remove();
//                 // $element.html('');
//             }
//         }
//     }
// });

app.directive('newDirective', function($compile) {
    return {
        // restrict: 'E',
        // replace: true,
        // scope: {},
        scope: true,
        template:
            '<div style="padding-bottom: 5px;">' +
            '<input type="text" ng-model="model.name" placeholder="Key">' +
            '<input style="margin-left: 2px;" type="text" ng-model="model.value" placeholder="Value">' +
            '<button style="margin-left: 3px;" ng-click="remove()">X</button>' +
            '</div>',
        link: function(scope, element, attributes) {
            scope.remove = function() {
            scope.$parent.local = 'newDirective';
            console.log(scope.local);
                element.remove();
            }

        }
    }
});

app.directive('keyValue', function($compile) {

    return {
        scope : true,

        // restrict: 'E',

        // transclude: true,

        template:  '<div id="customMainDiv"></div><br>'+
                '<a href data-ng-click="getData()">+ Add New Pair</a>',
        link: function(scope, element, attrs) {

            scope.getData = function() {
                scope.local = 'keyValue';
                console.log(scope.local);
                $newDirective = angular.element('<new-directive>');
                element.find("div#customMainDiv").append($newDirective);
                $compile($newDirective)(scope);
            }

        }
    };
});
