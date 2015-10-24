'use strict';

var fork = require('child_process').fork;
var path = require('path');
var through = require('through2');
var merge = require('lodash.merge');
var PluginError = require('gulp-util').PluginError;
var entry = path.resolve(__dirname, './fork.js');

function createError(payload) {
  return new PluginError('gulp-tape', payload);
}

function getTestRunner(reporter, outputStream, map, callback) {
  return through.obj(function(file, encoding, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }

    if (file.isStream()) {
      return cb(createError('Streaming is not supported'));
    }

    fork(entry, [file.contents.toString(), file.path, JSON.stringify(map || {})], {
      silent: true
    }).on('error', function(err){
        console.error(err);
        cb(createError(err));
      })
      .on('exit', function(code){
        if (code !== 0) {
          return cb(createError(file.path + ' exited with non-zero code: ' + code));
        }
        cb(null, file);
      })
      .on('message', function(payload){
        merge(global, payload);
      }).stdout.pipe(reporter).pipe(outputStream);
  }, callback);
}

function gulpTape(opts) {
  opts = opts || {};

  var outputStream = opts.outputStream || process.stdout;
  var reporter     = opts.reporter     || through.obj();
  var exec         = opts.exec;

  if (!exec) {
    return getTestRunner(reporter, outputStream);
  } else {
    var map = {};

    return through.obj(function(file, encoding, cb){
      map[file.path] = file.contents.toString();
      cb(null, file);
    }, function(callback){
      exec.pipe(getTestRunner(reporter, outputStream, map, function(){
        callback();
      })).on('error', callback);
    });
  }
}

module.exports = gulpTape;
