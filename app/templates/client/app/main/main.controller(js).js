'use strict';

/**
 * @ngdoc controller
 * @name <%= scriptAppName %>.controller:MainCtrl
 * @description The main controller for the default page
 * @requires $scope
 * @requires $http<% if(filters.socketio) { %>
 * @requires <%= scriptAppName %>.service:socket<% } %>
 */

angular.module('<%= scriptAppName %>')
  .controller('MainCtrl', function ($scope, $http<% if(filters.socketio) { %>, socket<% } %>) {
    /**
     * @ngdoc
     * @propertyOf <%= scriptAppName %>.controller:MainCtrl
     * @name <%= scriptAppName %>.controller:MainCtrl#awesomeThings
     * @description A list of awesome things.
     */
    $scope.awesomeThings = [];

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;<% if(filters.socketio) { %>
      socket.syncUpdates('thing', $scope.awesomeThings);<% } %>
    });
<% if(filters.mongoose) { %>
    /**
     * @ngdoc
     * @methodOf <%= scriptAppName %>.controller:MainCtrl
     * @name <%= scriptAppName %>.controller:MainCtrl#addThing
     * @description Saves the current thing on the scope via the api
     */
    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    /**
     * @ngdoc
     * @methodOf <%= scriptAppName %>.controller:MainCtrl
     * @name <%= scriptAppName %>.controller:MainCtrl#deleteThing
     * @param {Thing._id} thing The _id of the thing to delete
     * @description Deletes the specified thing via the api
     */
    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };<% } %><% if(filters.socketio) { %>

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });<% } %>
  });
