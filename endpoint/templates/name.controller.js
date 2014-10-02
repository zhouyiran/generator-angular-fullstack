'use strict';<% if(filters.mongoose) { %>

var _ = require('lodash');
var <%= classedName %> = require('./<%= name %>.model');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.send(statusCode, err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      return res.json(statusCode, entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.send(404);
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(function() {
          return res.send(204);
        });
    }
  };
}<% } %>

// Gets list of <%= name %>s from the DB.
exports.index = function(req, res) {
  <% if(!filters.mongoose) { %>
  res.json([]);
  <% } else { %>
  <%= classedName %>.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));<% } %>
};<% if(filters.mongoose) { %>

// Gets a single <%= name %> from the DB.
exports.show = function(req, res) {
  <%= classedName %>.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new <%= name %> in the DB.
exports.create = function(req, res) {
  <%= classedName %>.createAsync(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Sets the sent <%= name %> as available at :id
exports.replace = function(req, res) {
  if(!req.params.id) { return res.send(404); }
  req.body._id = req.params.id;
  <%= classedName %>.findByIdAndUpdate(req.params.id, req.body, {upsert: true}, function(err, <%= name %>) {
    if(err) { return handleError(res, err); }
    if(!<%= name %>) { return res.send(500); }

    return res.json(200, <%= name %>);
  });
};

// Updates an existing <%= name %> in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  <%= classedName %>.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a <%= name %> from the DB.
exports.destroy = function(req, res) {
  <%= classedName %>.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};<% } %>
