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
      var tapeStream = tape.createStream(tapeOpts);
      tapeStream.pipe(reporter).pipe(outputStream);
      files.forEach(function(file) {
        requireUncached(file);
      });
      var results = tape.getHarness()._results;
      results.once('done', function () {

        // The following messages will never reach the reporter,
        // if we end the tape output here.
        var write = this._stream.push.bind(this._stream);
        write('\n1..' + this.count + '\n');
        write('# tests ' + this.count + '\n');
        write('# pass  ' + this.pass + '\n');
        if (this.fail) {
          write('# fail  ' + this.fail + '\n');
        } else {
          write('\n# ok\n');
        }

        // Reset the results status
        this.count = 0;
        this.fail = 0;
        this.pass = 0;

        tapeStream.push(null);

        cb();
      });

      // Each time `tape.createStream` is called,
      // `results._stream` `pipe` to a new output stream,
      // and more listeners are added.
      // So we have to remove the max limit.
      results._stream.setMaxListeners(0);
    } catch (err) {
      cb(new PluginError(PLUGIN_NAME, err));
    }
  };

  return through.obj(transform, flush);
};

module.exports = gulpTape;
