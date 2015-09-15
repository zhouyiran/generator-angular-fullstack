'use strict';
(function() {

class MainController {
  awesomeThings = [];

  constructor($scope, $http<% if (filters.socketio) { %>, socket<% } %>) {
    this.$http = $http;

    $http.get('/api/things').then(response => {
      this.awesomeThings = response.data;<% if (filters.socketio) { %>
      socket.syncUpdates('thing', this.awesomeThings);<% } %>
    });

    $scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });<% } %>
  }

  <% if (filters.models) { %>
  addThing() {
    if (this.newThing === '') {
      return;
    }
    this.$http.post('/api/things', { name: this.newThing });
    this.newThing = '';
  };

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  };<% } %><% if (filters.socketio) { %>
}

angular.module('<%= scriptAppName %>')
  .controller('MainController', MainController);

})();
