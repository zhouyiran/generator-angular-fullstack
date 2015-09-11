'use strict';

import path from 'path';
import fs from 'fs';
import glob from 'glob';

/**
 * @param {} pattern
 * @param {Object} [options={}]
 * @param {String} [options.cwd] - Current Working Directory
 */
function expandFiles(pattern, options = {}) {
  var cwd = options.cwd || process.cwd();
  return glob.sync(pattern, options).filter(filepath => fs.statSync(path.join(cwd, filepath)).isFile());
}

/**
 * 
 */
export function rewriteFile(args) {
  args.path = args.path || process.cwd();
  var fullPath = path.join(args.path, args.file);

  args.haystack = fs.readFileSync(fullPath, 'utf8');
  var body = rewrite(args);

  fs.writeFileSync(fullPath, body);
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

/**
 * @param {} args
 */
export function rewrite(args) {
  // check if splicable is already in the body text
  var re = new RegExp(args.splicable.map(line => '\s*' + escapeRegExp(line)).join('\n'));

  if (re.test(args.haystack)) {
    return args.haystack;
  }

  var lines = args.haystack.split('\n');

  var otherwiseLineIndex = -1;
  lines.forEach(function (line, i) {
    if (line.indexOf(args.needle) !== -1) {
      otherwiseLineIndex = i;
    }
  });
  if(otherwiseLineIndex === -1) return lines.join('\n');

  var spaces = 0;
  while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
    spaces += 1;
  }

  var spaceStr = '';
  while ((spaces -= 1) >= 0) {
    spaceStr += ' ';
  }

  lines.splice(otherwiseLineIndex + 1, 0, args.splicable.map(function(line) {
    return spaceStr + line;
  }).join('\n'));

  return lines.join('\n');
}

export function appSuffix(self) {
  var suffix = self.options['app-suffix'];
  return (typeof suffix === 'string') ? self.lodash.classify(suffix) : '';
}

/**
 * @param {String} to
 * @param {String} [from=this.filePath]
 */
export function relativeRequire(to, from = this.filePath) {
  from = this.destinationPath(from);
  to = this.destinationPath(to);
  return path.relative(path.dirname(from), to)
    .replace(/\\/g, '/') // convert win32 separator to posix
    .replace(/^(?!\.\.)(.*)/, './$1') // prefix non parent path with ./
    .replace(/[\/\\]index\.js$/, ''); // strip index.js suffix from path
}

/**
 * @returns {Object} - name: template name sans parens filters, filters: array of parens filters
 */
function extractFilenameFilters(template) {
  // Find matches for parans
  var filterMatches = template.match(/\(([^)]+)\)/g);
  var filters = [];
  if(filterMatches) {
    filterMatches.forEach(function(filter) {
      filters.push(filter.replace('(', '').replace(')', ''));
      template = template.replace(filter, '');
    });
  }

  return { name: template, filters: filters };
}

function templateIsUsable(self, filteredFile) {
  var filters = self.filters || self.config.get('filters');
  var enabledFilters = [];
  for(var key in filters) {
    if(filters[key]) enabledFilters.push(key);
  }
  var matchedFilters = self.lodash.intersection(filteredFile.filters, enabledFilters);
  // check that all filters on file are matched
  if(filteredFile.filters.length && matchedFilters.length !== filteredFile.filters.length) {
    return false;
  }
  return true;
}

/**
 * @param {String} source
 * @param {String} destination
 */
export function processDirectory(source, destination) {
  var root = path.isAbsolute(source) ? source : path.join(this.sourceRoot(), source);
  var files = expandFiles('**', { dot: true, cwd: root });
  var dest, src;

  files.forEach(file => {
    var filteredFile = extractFilenameFilters(file);
    if(this.basename) {
      filteredFile.name = filteredFile.name.replace('basename', this.basename);
    }
    if(this.name) {
      filteredFile.name = filteredFile.name.replace('name', this.name);
    }
    var name = filteredFile.name;
    var copy = false;
    var stripped;

    src = path.join(root, file);
    dest = path.join(destination, name);

    if(path.basename(dest).indexOf('_') === 0) {
      stripped = path.basename(dest).replace(/^_/, '');
      dest = path.join(path.dirname(dest), stripped);
    }

    if(path.basename(dest).indexOf('!') === 0) {
      stripped = path.basename(dest).replace(/^!/, '');
      dest = path.join(path.dirname(dest), stripped);
      copy = true;
    }

    if(templateIsUsable(this, filteredFile)) {
      if(copy) {
        this.fs.copy(src, dest);
      } else {
        this.filePath = dest;
        this.fs.copyTpl(src, dest, this);
        delete this.filePath;
      }
    }
  });
}
