'use strict';

/**
 * @ngdoc controller
 * @name <%= scriptAppName %>.controller:SettingsCtrl
 * @description A controller for the settings page
 * @requires $scope
 * @requires <%= scriptAppName %>.service:User
 * @requires <%= scriptAppName %>.service:Auth
 */
angular.module('<%= scriptAppName %>')
  .controller('SettingsCtrl', function ($scope, User, Auth) {

    /**
     * @ngdoc
     * @propertyOf <%= scriptAppName %>.controller:SettingsCtrl
     * @name <%= scriptAppName %>.controller:SettingsCtrl#errors
     * @description A map of errors indexed by type.
     */
    $scope.errors = {};

    /**
     * @ngdoc
     * @methodOf <%= scriptAppName %>.controller:SettingsCtrl
     * @name <%= scriptAppName %>.controller:SettingsCtrl#changePassword
     * @description A function to change the user's password
     */
    $scope.changePassword = function() {
      $scope.submitted = true;
      if($scope.form.$valid) {
        Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
          .then(function() {
            $scope.message = 'Password successfully changed.';
          })
          .catch(function() {
            $scope.form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };
  });
