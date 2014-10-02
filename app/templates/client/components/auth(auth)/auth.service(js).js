'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.service:Auth
 * @description The Auth service is here to help you authorize.
 * @requires $location
 * @requires $rootScope
 * @requires $http
 * @requires <%= scriptAppName %>.service:User
 * @requires $cookieStore
 * @requires $q
 */

angular.module('<%= scriptAppName %>')
  .factory('Auth', function Auth($http, User, $cookieStore, $q) {

    var safeCb = function(cb) {
      return (angular.isFunction(cb)) ? cb : angular.noop;
    },

    currentUser = {};

    if ($cookieStore.get('token')) {
      currentUser = User.get();
    }

    return {

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName %>.service:Auth#login
       * @param  {User}   user     - login info
       * @param  {Function} callback - optional
       * @returns {Promise} A promise to be fulfilled on login
       * @description Authenticate user and save token
       */
      login: function(user, callback) {
        return $http.post('/auth/local', {
          email: user.email,
          password: user.password
        })
        .then(function(res) {
          $cookieStore.put('token', res.data.token);
          currentUser = User.get();
          safeCb(callback)();
          return res.data;
        }, function(err) {
          this.logout();
          safeCb(callback)(err.data);
          return $q.reject(err.data);
        }.bind(this));
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName %>.service:Auth#logout
       * @description Delete access token and user info
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = {};
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName.service %>:Auth#createUser
       * @param  {User}   user User information. Requires format as follows:
       * ```javascript
       * {
       *   email: 'foo@bar.com',
       *   name: 'Foo Bar',
       *   password: 'il0v3Angul4r!'
       * }
       * ```
       * @param  {Function} callback - optional
       * @returns {Promise} To be fulfilled upon verification from the server
       * @description Create a new user
       */
      createUser: function(user, callback) {
        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return safeCb(callback)(null, user);
          },
          function(err) {
            this.logout();
            return safeCb(callback)(err);
          }.bind(this)).$promise;
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName %>.service:Auth#changePassword
       * @param  {String}   oldPassword The user's old password
       * @param  {String}   newPassword The user's new password
       * @param  {Function} [callback] A callback to be called when the password is changed.
       * @returns {Promise} A promise that will be resolved when the password is changed.
       * @description Change password
       *
       * @example
       * <example module="<%= scriptAppName %>">
       *   <file name="script.js">
       *     Auth.changePassword('foo', 'bar', console.log);
       *   </file>
       *   <file name="script.html">
       *     <div style="background-color: yellow;">
       *       <h1>Hello</h1>
       *     </div>
       *   </file>
       * </example>
       */
      changePassword: function(oldPassword, newPassword, callback) {
        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return safeCb(callback)(null, user);
        }, function(err) {
          return safeCb(callback)(err);
        }).$promise;
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName %>.service:Auth#getCurrentUser
       * @param {Function} [callback] An optional callback. If passed, will be invoked async.
       * @returns {User|Promise} The current logged-in user
       * @description Get the current logged-in user
       */
      getCurrentUser: function(callback) {
        if (arguments.length === 0) {
          return currentUser;
        }

        var value = (currentUser.hasOwnProperty('$promise')) ? currentUser.$promise : currentUser;
        return $q.when(value)
          .then(function(user) {
            safeCb(callback)(user);
            return user;
          }, function() {
            safeCb(callback)({});
            return {};
          });
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName %>.service:Auth#isLoggedIn
       * @param {Function} [callback] An optional callback. If passed, will be invoked async.
       * @returns {Promise} A promise that will be resolved when the user is logged in.
       * @description Check if a user is logged in
       */
      isLoggedIn: function(callback) {
        if (arguments.length === 0) {
          return currentUser.hasOwnProperty('role');
        }
        return this.getCurrentUser(null)
          .then(function(user) {
            var is = user.hasOwnProperty('role');
            safeCb(callback)(is);
            return is;
          });
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName %>.service:Auth#isAdmin
       * @param {Function} [callback] An optional callback. If passed, will be invoked async.
       * @returns {Boolean|Promise} Whether or not the user is an admin, or a promise
       * @description Check if a user is an admin
       */
      isAdmin: function(callback) {
        if (arguments.length === 0) {
          return currentUser.role === 'admin';
        }

        return this.getCurrentUser(null)
          .then(function(user) {
            var is = user.role === 'admin';
            safeCb(callback)(is);
            return is;
          });
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName %>.service:Auth#getToken
       * @description Get Auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
