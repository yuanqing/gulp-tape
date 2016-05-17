'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var istanbul = require('gulp-istanbul');
var tapColorize = require('tap-colorize');

var tape = require('../');

gulp.task('test', function() {
  return gulp.src('fixtures/test/*.js')
    .pipe(tape({
      bail: true,
      reporter: tapColorize()
    }))
    .on('error', function(error) {
      gutil.log(error.message);
      process.exit(1);
    });
});

gulp.task('istanbul', function(cb) {
  gulp.src('fixtures/*.js')
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function() {
      gulp.src('fixtures/test/*.js')
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

gulp.task('watch', function() {
  gulp.watch('fixtures/test/*.js', ['test']);
});
