'use strict';

var spawn = require('child_process').spawn;
var through = require('through2');
var PluginError = require('gulp-util').PluginError;

function createError(payload) {
  return new PluginError('gulp-tape', payload);
}

function gulpTape(opts) {
  opts = opts || {};

  var outputStream = opts.outputStream || process.stdout;
  var reporter     = opts.reporter     || through.obj();

  return through.obj(function(file, encoding, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      return cb(createError('Streaming is not supported'));
    }

    spawn('node', [file.path])
      .on('error', function(err){
        cb(createError(err));
      })
      .on('exit', function(code){
        if (code !== 0) {
          return cb(createError(file.path + ' exited with non-zero code: ' + code));
        }
        cb();
      })
      .stdout.pipe(reporter).pipe(outputStream);
  });
}

module.exports = gulpTape;
