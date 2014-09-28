'use strict'

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.service:User
 * @description  User is a $resource to help manage users.
 */

angular.module '<%= scriptAppName %>'
.factory 'User', ($resource) ->
  $resource '/api/users/:id/:controller',
    id: '@_id'
  ,

    /**
     * @ngdoc
     * @methodOf <%= scriptAppName %>.service:User
     * @name <%= scriptAppName %>.service:User#changePassword
     * @description Update a `User`'s password
     */

    changePassword:
      method: 'PUT'
      params:
        controller: 'password'

    /**
     * @ngdoc
     * @methodOf <%= scriptAppName %>.service:User
     * @name <%= scriptAppName %>.service:User#get
     * @description Get details about the currently logged-in user
     */

    get:
      method: 'GET'
      params:
        id: 'me'

