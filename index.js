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
      var closed = false;
      var harness = tape.getHarness();
      var results = harness._results;
      harness.close = function () {
        if (!closed) {
          closed = true;
          results.close();
          cb();
        }
      };
      results.once('done', function () {
        harness.close();
      });
    } catch (err) {
      cb(new PluginError(PLUGIN_NAME, err));
    }
  };

  return through.obj(transform, flush);
};

module.exports = gulpTape;
