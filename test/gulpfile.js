const gulp = require('gulp')
const gutil = require('gulp-util')

const tape = require('../')

gulp.task('test', function () {
  return gulp
    .src('fixtures/test.js')
    .pipe(
      tape({
        bail: true
      })
    )
    .on('error', function (error) {
      gutil.log(error.message)
      process.exit(1)
    })
})
