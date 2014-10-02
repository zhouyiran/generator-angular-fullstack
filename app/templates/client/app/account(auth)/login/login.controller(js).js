'use strict';

/**
 * @ngdoc controller
 * @name <%= scriptAppName %>.controller:LoginCtrl
 * @requires $scope
 * @requires <%= scriptAppName %>.service:Auth
 * @requires $location
 * @description LoginCtrl exposes login functionality
 */

angular.module('<%= scriptAppName %>')
  .controller('LoginCtrl', function($scope, Auth<% if (filters.ngroute) { %>, $location<% } %><% if (filters.uirouter) { %>, $state<% } %><% if (filters.oauth) { %>, $window<% } %>) {

    /**
     * @ngdoc
     * @propertyOf <%= scriptAppName %>.controller:LoginCtrl
     * @name <%= scriptAppName %>.controller:LoginCtrl#user
     * @description The current user
     */

    $scope.user = {};

    /**
     * @ngdoc
     * @propertyOf <%= scriptAppName %>.controller:LoginCtrl
     * @name <%= scriptAppName %>.controller:LoginCtrl#errors
     * @description A list of errors by errortype key.
     *
     * For example:
     * ```javascript
     *  var errors = { other: 'message' }
     * ```
     */
    $scope.errors = {};

    /**
     * @ngdoc
     * @methodOf <%= scriptAppName %>.controller:LoginCtrl
     * @name <%= scriptAppName %>.controller:LoginCtrl#login
     * @description A method to login to the application, if the current login form is valid
     */

    $scope.login = function() {
      $scope.submitted = true;

      if($scope.form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then(function() {
          // Logged in, redirect to home
          <% if (filters.ngroute) { %>$location.path('/');<% } %><% if (filters.uirouter) { %>$state.go('main');<% } %>
        })
        .catch(function(err) {
          $scope.errors.other = err.message;
        });
      }
    };
<% if (filters.oauth) {%>

    /**
     * @ngdoc
     * @methodOf <%= scriptAppName %>.controller:LoginCtrl
     * @name <%= scriptAppName %>.controller:LoginCtrl#loginOauth
     * @description A method to login to the application using an Oauth provider
     */

    $scope.loginOauth = function(provider) {
      $location.path('/auth/' + provider);
    };<% } %>
  });
