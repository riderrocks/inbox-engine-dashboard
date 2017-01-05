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
        restrict: 'E',
        replace: true,
        scope: {},
        template:
            '<div style="padding-bottom: 5px;">' +
            '<input type="text" placeholder="Key">' +
            '<input style="margin-left: 2px;" type="text" placeholder="Value">' +
            '<button style="margin-left: 3px;" ng-click="remove()">X</button>' +
            '</div>',
        link: function(scope, element, attributes) {
            scope.remove = function() {
                element.remove();
            }
        }
    }
});

app.directive('keyValue', function($compile) {

    return {

        restrict: 'E',

        transclude: true,

        template:  '<div id="customMainDiv"></div><br>'+
                '<a href data-ng-click="getData()">+ Add New Pair</a>',
        link: function(scope, element, attrs) {

            scope.getData = function() {
                $newDirective = angular.element('<new-directive>');
                element.find("div#customMainDiv").append($newDirective);
                $compile($newDirective)(scope);
            }

        }
    };
});
