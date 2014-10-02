'use strict';

/**
 * @ngdoc controller
 * @name <%= scriptAppName %>.controller:NavbarCtrl
 * @description Exposes appropriate information to the navbar
 */

angular.module('<%= scriptAppName %>')
  .controller('NavbarCtrl', function ($scope<% if(!filters.uirouter) { %>, $location<% } %><% if (filters.auth) {%>, Auth<% } %>) {

    /**
     * @ngdoc
     * @propertyOf <%= scriptAppName %>.controller:NavbarCtrl
     * @name <%= scriptAppName %>.controller:NavbarCtrl#menu
     * @description An array of menu items
     */
    $scope.menu = [{
      'title': 'Home',
      <% if (filters.uirouter) { %>'state': 'main'<% } else { %>'link': '/'<% } %>
    }];

    /**
     * @ngdoc
     * @propertyOf <%= scriptAppName %>.controller:NavbarCtrl
     * @name <%= scriptAppName %>.controller:NavbarCtrl#isCollapsed
     * @type {Boolean}
     * @description Is the menu collapsed?
     */
    $scope.isCollapsed = true;<% if (filters.auth) {%>

    /**
     * @ngdoc
     * @propertyOf <%= scriptAppName %>.controller:NavbarCtrl
     * @name <%= scriptAppName %>.controller:NavbarCtrl#isLoggedIn
     * @description True if a user is logged in.
     */
    $scope.isLoggedIn = Auth.isLoggedIn;

    /**
     * @ngdoc
     * @propertyOf <%= scriptAppName %>.controller:NavbarCtrl
     * @name <%= scriptAppName %>.controller:NavbarCtrl#isAdmin
     * @description True if the currently-logged-in user is an admin.
     */
    $scope.isAdmin = Auth.isAdmin;

    /**
     * @ngdoc
     * @methodOf <%= scriptAppName %>.controller:NavbarCtrl
     * @name <%= scriptAppName %>.controller:NavbarCtrl#logout
     * @description Logs the current user out
     */
    $scope.logout = function() {
      Auth.logout();
      $location.path('/login');
    };

    /**
     * @ngdoc
     * @methodOf <%= scriptAppName %>.controller:NavbarCtrl
     * @name <%= scriptAppName %>.controller:NavbarCtrl#getCurrentUser
     * @description A function to return the current user
     * @returns {User} The currently-logged-in user
     */
    $scope.getCurrentUser = Auth.getCurrentUser;<% } %><% if(!filters.uirouter) { %>

    /**
     * @ngdoc
     * @methodOf <%= scriptAppName %>.controller:NavbarCtrl
     * @name <%= scriptAppName %>.controller:NavbarCtrl#isActive
     * @param {String} route The route to check
     * @returns {Boolean} Whether or not the passed item is active.
     * @description A method to check which navbar item is active.
     */
    $scope.isActive = function(route) {
      return route === $location.path();
    };<% } %>
  });
