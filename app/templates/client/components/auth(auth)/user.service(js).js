'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.service:User
 * @description  User is a $resource to help manage users.
 * @requires $resource
 */

angular.module('<%= scriptAppName %>')
  .factory('User', function ($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    },
    {

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:User
       * @name <%= scriptAppName %>.service:User#changePassword
       * @description Update a `User`'s password
       *
       * For example:
       *
       * ```javascript
       * angular.module('pass')
       *   .controller('foo', function($scope, User) {
       *     var user = User.get();
       *     user.$promise.then(function() {
       *       user.password = 'ih34rt4ngul4rFullst4ck!'
       *       user.changePassword({
       *         oldPassword: 'foo',
       *         newPassword: 'bar',
       *       });
       *     });
       *   });
       * ```
       */

      changePassword: {
        method: 'PUT',
        params: {
          controller:'password'
        }
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:User
       * @name <%= scriptAppName %>.service:User#get
       * @description Get details about the currently logged-in user
       */

      get: {
        method: 'GET',
        params: {
          id:'me'
        }
      }
	  });
  });
