'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var tapColorize = require('tap-colorize');

var tape = require('../');

gulp.task('test', function() {
  return gulp.src('fixtures/test/*.js')
    .pipe(tape({
      reporter: tapColorize()
    }));
});

'use strict';

var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var tapColorize = require('tap-colorize');

var tape = require('../');

gulp.task('test', function() {
  return gulp.src('fixtures/test/*.js')
    .pipe(tape({
      reporter: tapColorize()
    }));
});

gulp.task('istanbul', function(cb) {
  return gulp.src('fixtures/*.js')
    .pipe(istanbul())
    .pipe(tape({
      'exec': gulp.src('fixtures/test/*.js')
    }))
    .pipe(istanbul.writeReports({
      reporters: ['lcov', 'text']
    }))
    .pipe(istanbul.enforceThresholds({
      thresholds: {
        global: {
          statements: 83,
          functions: 90,
          branches: 75,
          lines: 83
        }
      }
    }));
});
