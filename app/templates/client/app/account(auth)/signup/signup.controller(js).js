'use strict';

/**
 * @ngdoc controller
 * @name <%= scriptAppName %>.controller:SignupCtrl
 * @description The controller for signups
 * @requires $scope
 * @requires <%= scriptAppName %>.service:Auth<% if(filters.oauth) { %>
 * @requires $location<% } %>
 */

angular.module('<%= scriptAppName %>')
  .controller('SignupCtrl', function ($scope, Auth, $location<% if (filters.oauth) { %>, $window<% } %>) {

    /**
     * @ngdoc
     * @propertyOf <%= scriptAppName %>.controller:SignupCtrl
     * @name <%= scriptAppName %>.controller:SignupCtrl#user
     * @description The current user
     */

    $scope.user = {};

    /**
     * @ngdoc
     * @propertyOf <%= scriptAppName %>.controller:SignupCtrl
     * @name <%= scriptAppName %>.controller:SignupCtrl#errors
     * @description A map of any errors indexed by type.
     */
    $scope.errors = {};

    /**
     * @ngdoc
     * @methodOf <%= scriptAppName %>.controller:SignupCtrl
     * @name <%= scriptAppName %>.controller:SignupCtrl#register
     * @description A function to register a new user.
     */
    $scope.register = function() {
      $scope.submitted = true;

      if($scope.form.$valid) {
        Auth.createUser({
          name: $scope.user.name,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Account created, redirect to home
          $location.path('/');
        })
        .catch( function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            $scope.form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };
<% if(filters.oauth) {%>

  /**
   * @ngdoc
   * @methodOf <%= scriptAppName %>.controller:SignupCtrl
   * @name <%= scriptAppName %>.controller:SignupCtrl#loginOauth
   * @param {String} provider The (local) name of the provider to use for authentication
   * @description A function to login with oauth.  Simply changes the route and the routing takes care of the rest.
   */
    $scope.loginOauth = function(provider) {
      $window.location.href = '/auth/' + provider;
    };<% } %>
  });
