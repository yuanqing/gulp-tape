'use strict';

var gulp = require('gulp');
var tape = require('../');
var tapColorize = require('tap-colorize');

gulp.task('default', function() {
  return gulp.src('fixtures/*.js')
    .pipe(tape({
      reporter: tapColorize()
    }));
});
