'use strict';

var tape = require('tape');
var through = require('through2');
var PluginError = require('gulp-util').PluginError;
var requireUncached = require('require-uncached');

var PLUGIN_NAME = 'gulp-tape';

var gulpTape = function(opts) {
  opts = opts || {};

  var bail         = opts.bail         || false;
  var outputStream = opts.outputStream || process.stdout;
  var reporter     = opts.reporter     || through.obj();
  var tapeOpts     = opts.tapeOpts     || {};

  var files        = [];

  var transform = function(file, encoding, callback) {
    if (file.isNull()) {
      return callback(null, file);
    }
    if (file.isStream()) {
      return callback(new PluginError(PLUGIN_NAME, 'Streaming is not supported'));
    }
    files.push(file.path);
    callback(null, file);
  };

  var flush = function(callback) {
    try {
      var tapeStream = tape.createStream(tapeOpts);
      tapeStream.pipe(reporter).pipe(outputStream);
      files.forEach(function(file) {
        requireUncached(file);
      });
      var results = tape.getHarness()._results;
      results.once('done', function() {
        var shouldErrorOut = false;

        // The following messages will never reach the reporter if we end the
        // tape output here.
        var write = this._stream.push.bind(this._stream);
        write('\n1..' + this.count + '\n');
        write('# tests ' + this.count + '\n');
        write('# pass  ' + this.pass + '\n');
        if (this.fail) {
          write('# fail  ' + this.fail + '\n');

          // Some test failed; we should error out if and only if `bail`
          // is `true`.
          shouldErrorOut = bail;
        } else {
          write('\n# ok\n');
        }

        // Reset the counts.
        this.count = 0;
        this.fail = 0;
        this.pass = 0;
        tapeStream.push(null);

        callback(shouldErrorOut ? new PluginError(PLUGIN_NAME, 'Test failed') : null);
      });

      // This is hacky. Each time `tape.createStream` is called,
      // `results._stream` pipes to a new output stream, and more listeners
      // are added, so we have to remove the max limit.
      results._stream.setMaxListeners(0);
    } catch (err) {
      callback(new PluginError(PLUGIN_NAME, err));
    }
  };

  return through.obj(transform, flush);
};

module.exports = gulpTape;
