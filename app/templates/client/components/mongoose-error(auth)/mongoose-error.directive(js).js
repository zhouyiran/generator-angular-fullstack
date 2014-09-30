'use strict';

/**
 * @ngdoc directive
 * @name <%= scriptAppName %>.directive:mongooseError
 * @restrict A
 * @requires ngModel
 * @description A directive to remove server $invalid errors when the user updates the input field.
 */

angular.module('<%= scriptAppName %>')
  .directive('mongooseError', function () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, element, attrs, ngModel) {
        element.on('keydown', function() {
          return ngModel.$setValidity('mongoose', true);
        });
      }
    };
  });
