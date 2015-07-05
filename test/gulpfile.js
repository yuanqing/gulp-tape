'use strict';

var gulp = require('gulp');
var tape = require('../');

gulp.task('default', function() {
  return gulp.src('fixtures/*.js')
    .pipe(tape());
});
