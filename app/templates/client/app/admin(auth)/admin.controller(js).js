'use strict';

/**
 * @ngdoc controller
 * @name <%= scriptAppName %>.controller:AdminCtrl
 * @requires $scope
 * @requires $http
 * @requires <%= scriptAppName %>.service:Auth
 * @requires <%= scriptAppName %>.service:User
 * @description AdminCtrl exposes functionality for administration
 */

angular.module('<%= scriptAppName %>')
  .controller('AdminCtrl', function($scope, $http, Auth, User) {

    /**
     * @ngdoc
     * @propertyOf <%= scriptAppName %>.controller:AdminCtrl
     * @name <%= scriptAppName %>.controller:AdminCtrl#users
     * @description A list of users, queried from the api via the [User](/#/app/<%= scriptAppName %>.service:User) service
     */

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    /**
     * @ngdoc
     * @methodOf <%= scriptAppName %>.controller:AdminCtrl
     * @name <%= scriptAppName %>.controller:AdminCtrl#name
     * @param {User} user The user to delete.
     *
     * Really only needs to have an `_id` property of a valid user.
     * @description Deletes the specified user with an $http delete request
     */
    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
  });
