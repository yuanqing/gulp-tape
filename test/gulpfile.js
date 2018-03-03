const gulp = require('gulp')
const gutil = require('gulp-util')
const tapColorize = require('tap-colorize')

const tape = require('../')

gulp.task('test', function () {
  return gulp
    .src('fixtures/test.js')
    .pipe(
      tape({
        bail: true,
        reporter: tapColorize()
      })
    )
    .on('error', function (error) {
      gutil.log(error.message)
      process.exit(1)
    })
})
