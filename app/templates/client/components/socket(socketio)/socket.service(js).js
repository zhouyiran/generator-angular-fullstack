/* global io */
'use strict';

/**
 * @ngdoc service
 * @name <%= scriptAppName %>.service:socket
 * @description socket is a service that wraps a socket.io connection, applying angular $scope
 * digests when messages are received. It does this so that 3-way data binding can do its magic and
 * your data shows up in the right place.
 */

angular.module('<%= scriptAppName %>')
  .factory('socket', function(socketFactory) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return {
      /**
       * @ngdoc
       * @propertyOf <%= scriptAppName %>.service:socket
       * @name <%= scriptAppName %>.service:socket#socket
       * @type {socket.io.Socket}
       * @description The original socket.io socket
       */
      socket: socket,

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:socket
       * @name <%= scriptAppName %>.service:socket#syncUpdates
       * @description Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName The name of the model as expected to be sent from the socket.io server.
       * @param {Array} array The javascript array that should be synced via socket.io
       * @param {Function} cb A callback to be called when the `item:save` event is received.
       * @example
        <example module="testModule">
          <file name="example-ctrl.js">
            function foo($scope, socket) {
              $scope.awesomeThings = ['foo', 'bar'];
            }

            angular.module('testModule', []).controller('foo', function($scope, socket) {
              $scope.awesomeThings = ['angular', 'mongo', 'express', 'node'];

              socket.syncUpdates('awesomeThings', $scope.awesomeThings);

              $scope.$on('$destroy', function() {
                socket.unsyncUpdates('awesomeThings');
              });
            });
          </file>
          <file name="example.html">
            <div>
              <div ng-bind="thing" ng-repeat="thing in awesomeThings">Awesome Things will show up here.</div>
            </div>
          </file>
        </example>
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * @ngdoc
       * @methodOf <%= scriptAppName %>.service:socket
       * @name <%= scriptAppName %>.service:socket#unsyncUpdates
       * @param {String} modelName The model name for which to no longer sync updates.
       * @description Removes listeners for a given model's socket.io update events, triggered by Mongoose
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  });
