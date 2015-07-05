'use strict';

var tape = require('tape');
var through = require('through2');
var forEach = require('lodash.foreach');
var PluginError = require('gulp-util').PluginError;
var requireUncached = require('require-uncached');

var PLUGIN_NAME = 'gulp-tape';

var gulpTape = function(opts) {
  opts = opts || {};
  var outputStream = opts.outputStream || process.stdout;
  var files = [];
  var transform = function(file, encoding, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(new PluginError(PLUGIN_NAME, 'Streaming is not supported'));
    }
    files.push(file.path);
    cb(null, file);
  };
  var flush = function(cb) {
    try {
      tape.createStream().pipe(outputStream);
      forEach(files, function(file) {
        requireUncached(file);
      });
      cb();
    } catch (err) {
      cb(new PluginError(PLUGIN_NAME, err));
    }
  };
  return through.obj(transform, flush);
};

module.exports = gulpTape;
