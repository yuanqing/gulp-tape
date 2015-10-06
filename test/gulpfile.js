'use strict';

var gulp = require('gulp');
var tape = require('../');
var tapColorize = require('tap-colorize');

gulp.task('default', ['istanbul'], function() {
  return gulp.src('fixtures/*.js')
    .pipe(tape({
      reporter: tapColorize()
    }));
});


gulp.task('istanbul', function(cb) {
  var istanbul = require('gulp-istanbul');
  gulp.src('fixtures/istanbul/lib/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src('fixtures/istanbul/*.js')
        .on('error', cb)
        .on('end', cb)
        .pipe(tape())
        .pipe(istanbul.writeReports({
          reporters: ['lcov', 'text']
        }))
        .pipe(istanbul.enforceThresholds({
          thresholds: {
            global: {
              statements: 83,
              functions: 90,
              branches: 75,
              lines: 83,
            },
          },
        }));
    });
});

