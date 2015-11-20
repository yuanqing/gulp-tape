'use strict';

var tape = require('tape');
var through = require('through2');
var PluginError = require('gulp-util').PluginError;
var requireUncached = require('require-uncached');

var PLUGIN_NAME = 'gulp-tape';

var gulpTape = function(opts) {
  opts = opts || {};

  var outputStream = opts.outputStream || process.stdout;
  var reporter     = opts.reporter     || through.obj();
  var tapeOpts     = opts.tapeOpts     || {};
  var files        = [];

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
      tape.createStream(tapeOpts).pipe(reporter).pipe(outputStream);
      files.forEach(function(file) {
        requireUncached(file);
      });
      var tests = tape.getHarness()._tests;
      var pending = tests.length;
      if (pending === 0) {
        return cb();
      }
      tests.forEach(function(test) {
        test.once('end', function() {
          if (--pending === 0) {
            cb();
          }
        });
      });
    } catch (err) {
      cb(new PluginError(PLUGIN_NAME, err));
    }
  };

  return through.obj(transform, flush);
};

module.exports = gulpTape;
