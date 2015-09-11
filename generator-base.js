'use strict';

import util from 'util';
import path from 'path';
import _ from 'lodash';
import s from 'underscore.string';
import yoWelcome from 'yeoman-welcome';
import * as genUtils from './util';

// extend lodash with underscore.string
_.mixin(s.exports());

export function genBase(self) {
  self = self || this;

  self.lodash = _;
  self.yoWelcome = yoWelcome;

  self.appname = _.camelize(_.slugify(
    _.humanize(self.determineAppname())
  ));
  self.scriptAppName = self.appname + genUtils.appSuffix(self);

  self.filters = self.filters || self.config.get('filters');

  // dynamic assertion statements
  self.expect = function() {
    return self.filters.expect ? 'expect(' : '';
  };
  self.to = function() {
    return self.filters.expect ? ').to' : '.should';
  };

  // dynamic relative require path
  self.relativeRequire = genUtils.relativeRequire.bind(self);
  // process template directory
  self.processDirectory = genUtils.processDirectory.bind(self);
  // rewrite a file in place
  self.rewriteFile = genUtils.rewriteFile;
}

export function genNamedBase(self) {
  self = self || this;

  // extend genBase
  genBase(self);

  var name = self.name.replace(/\//g, '-');

  self.cameledName = _.camelize(name);
  self.classedName = _.classify(name);

  self.basename = path.basename(self.name);
  self.dirname = (self.name.indexOf('/') >= 0) ? path.dirname(self.name) : self.name;
}
