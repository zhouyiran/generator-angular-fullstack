'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.service:Auth
 * @description The Auth service is here to help you authorize.
 */

angular.module('<%= scriptAppName %>')
  .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q) {
    var currentUser = {};
    if($cookieStore.get('token')) {
      currentUser = User.get();
    }

    return {

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName %>.service:Auth#login
       * @param  {User}   user     - login info
       * @param  {Function} callback - optional
       * @returns {Promise} A promie to be fulfilled on login
       * @description Authenticate user and save token
       */
      login: function(user, callback) {
        var cb = callback || angular.noop;
        var deferred = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          currentUser = User.get();
          deferred.resolve(data);
          return cb();
        }).
        error(function(err) {
          this.logout();
          deferred.reject(err);
          return cb(err);
        }.bind(this));

        return deferred.promise;
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
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {
            $cookieStore.put('token', data.token);
            currentUser = User.get();
            return cb(user);
          },
          function(err) {
            this.logout();
            return cb(err);
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
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName %>.service:Auth#getCurrentUser
       * @returns {User} The current logged-in user
       * @description Get the current logged-in user
       */
      getCurrentUser: function() {
        return currentUser;
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName %>.service:Auth#isLoggedIn
       * @returns {Boolean} Whether or not a user is logged in
       * @description Check if a user is logged in
       */
      isLoggedIn: function() {
        return currentUser.hasOwnProperty('role');
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName %>.service:Auth#isLoggedInAsync
       * @param {Function} [cb] Callback to be called once the user is logged in.
       * @returns {Promise} The promise that will be resolved when the user is logged in
       * @description Waits for currentUser to resolve before checking if user is logged in
       */
      isLoggedInAsync: function(cb) {
        cb = cb || angular.noop;

        if(currentUser.hasOwnProperty('$promise')) {
          currentUser.$promise.then(function() {
            cb(true);
          }).catch(function() {
            cb(false);
          });

          return currentUser.$promise;
        } else if(currentUser.hasOwnProperty('role')) {
          cb(true);
        } else {
          cb(false);
        }
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:Auth
       * @name <%= scriptAppName %>.service:Auth#isAdmin
       * @returns {Boolean} Whether or not the user is an admin
       * @description Check if a user is an admin
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
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
